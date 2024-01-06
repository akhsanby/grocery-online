export default function getPaymentType(payment_type) {
  if (payment_type === "bca_va") {
    return {
      payment_type: "bank_transfer",
      bank_transfer: {
        bank: "bca",
      },
    };
  } else if (payment_type === "permata_va") {
    return {
      payment_type: "bank_transfer",
      bank_transfer: {
        bank: "permata",
      },
    };
  } else if (payment_type === "bni_va") {
    return {
      payment_type: "bank_transfer",
      bank_transfer: {
        bank: "bni",
      },
    };
  } else if (payment_type === "bri_va") {
    return {
      payment_type: "bank_transfer",
      bank_transfer: {
        bank: "bri",
      },
    };
  } else if (payment_type === "cimb_va") {
    return {
      payment_type: "bank_transfer",
      bank_transfer: {
        bank: "cimb",
      },
    };
  } else if (payment_type === "qris") {
    return {
      payment_type: "qris",
      qris: {
        acquirer: "gopay",
      },
    };
  } else if (payment_type === "indomaret") {
    return {
      payment_type: "cstore",
      cstore: {
        store: "Indomaret",
      },
    };
  } else if (payment_type === "alfamart") {
    return {
      payment_type: "cstore",
      cstore: {
        store: "alfamart",
      },
    };
  }
}
