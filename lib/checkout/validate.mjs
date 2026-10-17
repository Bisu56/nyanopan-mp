const PROVINCES = new Set([
  "Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim",
]);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

/** Validate untrusted checkout payload. Prices are intentionally not accepted. */
export function validateCheckoutPayload(value) {
  const errors = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { data: null, errors: { form: "Enter your delivery details." } };
  }
  const trim = (key) => typeof value[key] === "string" ? value[key].trim() : "";
  const customerName = trim("customerName");
  const rawPhone = trim("phone");
  const phone = rawPhone.replace(/[\s()-]/g, "");
  const province = trim("province");
  const district = trim("district");
  const municipality = trim("municipality");
  const ward = trim("ward");
  const fullAddress = trim("fullAddress");
  const deliveryNotes = trim("deliveryNotes");
  const paymentMethod = value.paymentMethod;

  if (customerName.length < 2 || customerName.length > 120 || CONTROL_CHARS.test(customerName)) errors.customerName = "Enter a name between 2 and 120 characters.";
  if (!/^\+?[0-9]{7,15}$/.test(phone)) errors.phone = "Enter a phone number with 7 to 15 digits.";
  if (!PROVINCES.has(province)) errors.province = "Choose a province.";
  if (district.length < 2 || district.length > 100 || CONTROL_CHARS.test(district)) errors.district = "Enter a district between 2 and 100 characters.";
  if (municipality.length < 2 || municipality.length > 120 || CONTROL_CHARS.test(municipality)) errors.municipality = "Enter a municipality between 2 and 120 characters.";
  if (!/^[0-9]{1,32}$/.test(ward)) errors.ward = "Enter a valid ward number.";
  if (fullAddress.length < 5 || fullAddress.length > 500 || CONTROL_CHARS.test(fullAddress)) errors.fullAddress = "Enter a full address between 5 and 500 characters.";
  if (deliveryNotes.length > 500 || CONTROL_CHARS.test(deliveryNotes)) errors.deliveryNotes = "Notes must be 500 characters or fewer.";
  if (paymentMethod !== "cod" && paymentMethod !== "manual") errors.paymentMethod = "Choose a payment method.";

  const items = value.items;
  if (!Array.isArray(items) || items.length < 1 || items.length > 50) {
    errors.items = "Your bag is empty or contains too many items.";
  } else {
    const seen = new Set();
    for (const line of items) {
      if (!line || typeof line !== "object" || !UUID_PATTERN.test(line.productId ?? "") ||
          !(line.variantId === null || (typeof line.variantId === "string" && UUID_PATTERN.test(line.variantId))) ||
          !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 99) {
        errors.items = "Your bag contains an invalid item.";
        break;
      }
      const key = `${line.productId}:${line.variantId ?? ""}`;
      if (seen.has(key)) {
        errors.items = "Your bag contains duplicate product options.";
        break;
      }
      seen.add(key);
    }
  }

  if (Object.keys(errors).length) return { data: null, errors };
  return {
    data: {
      customerName, phone, province, district, municipality, ward, fullAddress,
      deliveryNotes: deliveryNotes || null, paymentMethod,
      items: items.map(({ productId, variantId, quantity }) => ({ productId, variantId, quantity })),
    },
    errors,
  };
}

export { PROVINCES };

