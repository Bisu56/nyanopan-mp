import { randomUUID } from "node:crypto";
import { getAdminApiContext } from "@/lib/supabase/admin-api";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_BYTES = 5 * 1024 * 1024;
type Context = { params: Promise<{ id: string }> };

function sniffImage(bytes: Uint8Array) {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return { mime: "image/png", ext: "png" };
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return { mime: "image/webp", ext: "webp" };
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(4, 8)) === "ftyp" && ["avif", "avis"].includes(String.fromCharCode(...bytes.slice(8, 12)))) return { mime: "image/avif", ext: "avif" };
  return null;
}

export async function POST(request: Request, { params }: Context) {
  const { admin, response } = await getAdminApiContext(request);
  if (response || !admin) return response;
  const { id } = await params;
  if (!UUID.test(id)) return Response.json({ error: "Invalid product." }, { status: 400 });
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BYTES + 16 * 1024) {
    return Response.json({ error: "Image uploads must be no larger than 5 MiB." }, { status: 413 });
  }

  let form: FormData;
  try { form = await request.formData(); } catch { return Response.json({ error: "Send an image file." }, { status: 400 }); }
  const file = form.get("image");
  const altText = form.get("altText");
  if (!(file instanceof File) || file.size < 1 || file.size > MAX_BYTES || typeof altText !== "string" || altText.trim().length > 200) {
    return Response.json({ error: "Choose an image under 5 MiB and enter alt text up to 200 characters." }, { status: 400 });
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const image = sniffImage(bytes);
  if (!image || image.mime !== file.type) return Response.json({ error: "Only valid JPEG, PNG, WebP or AVIF images are accepted." }, { status: 400 });

  const { data: product, error: productError } = await admin.supabase.from("products").select("id").eq("id", id).maybeSingle();
  if (productError || !product) return Response.json({ error: "Product not found." }, { status: 404 });
  const path = `${id}/${randomUUID()}.${image.ext}`;
  const { error: uploadError } = await admin.supabase.storage.from("product-images").upload(path, bytes, {
    contentType: image.mime,
    upsert: false,
    cacheControl: "3600",
  });
  if (uploadError) return Response.json({ error: "Image upload failed. Check Storage access and try again." }, { status: 400 });

  const { data, error } = await admin.supabase.from("product_images").insert({
    product_id: id, storage_path: path, alt_text: altText.trim(), sort_order: 0,
  }).select("id").single();
  if (error || !data) {
    await admin.supabase.storage.from("product-images").remove([path]);
    return Response.json({ error: "Image details could not be saved." }, { status: 400 });
  }
  return Response.json({ id: data.id }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
