const tempProductStorage = {};
let tempIdCounter = 1;

function normalizeBillId(billId) {
  return String(billId);
}

function cloneProducts(products) {
  return products.map((product) => ({ ...product }));
}

function getProductsForBill(billId) {
  const key = normalizeBillId(billId);
  return cloneProducts(tempProductStorage[key] || []);
}

function clearProductsForBill(billId) {
  const key = normalizeBillId(billId);
  delete tempProductStorage[key];
}

function upsertProduct(product) {
  const key = normalizeBillId(product.bill_id);

  if (!tempProductStorage[key]) {
    tempProductStorage[key] = [];
  }

  const existingIndex = tempProductStorage[key].findIndex(
    (item) =>
      item.bata === product.bata &&
      Number(item.rate) === Number(product.rate) &&
      item.product === product.product
  );

  if (existingIndex >= 0) {
    const existingProduct = tempProductStorage[key][existingIndex];
    const newQuantity = Number(existingProduct.quantity) + Number(product.quantity);

    tempProductStorage[key][existingIndex] = {
      ...existingProduct,
      mark: product.mark,
      quantity: newQuantity,
      price: Number(product.rate) * newQuantity,
      editable: 1,
      is_temp: true,
    };

    return { item: { ...tempProductStorage[key][existingIndex] }, products: getProductsForBill(key) };
  }

  const tempProduct = {
    id: `temp-${Date.now()}-${tempIdCounter++}`,
    bill_id: product.bill_id,
    bata: product.bata,
    mark: product.mark,
    product: product.product,
    quantity: Number(product.quantity),
    rate: Number(product.rate),
    price: Number(product.price),
    editable: 1,
    is_temp: true,
  };

  tempProductStorage[key].push(tempProduct);
  return { item: { ...tempProduct }, products: getProductsForBill(key) };
}

function updateProduct(productId, updates) {
  for (const billId of Object.keys(tempProductStorage)) {
    const productIndex = tempProductStorage[billId].findIndex((item) => item.id === productId);

    if (productIndex >= 0) {
      const existingProduct = tempProductStorage[billId][productIndex];
      const updatedProduct = {
        ...existingProduct,
        bata: updates.bata ?? existingProduct.bata,
        mark: updates.mark ?? existingProduct.mark,
        product: updates.product ?? existingProduct.product,
        quantity: Number(updates.quantity ?? existingProduct.quantity),
        rate: Number(updates.rate ?? existingProduct.rate),
      };

      updatedProduct.price = Number(
        updates.price ?? updatedProduct.quantity * updatedProduct.rate
      );
      updatedProduct.editable = 1;
      updatedProduct.is_temp = true;

      tempProductStorage[billId][productIndex] = updatedProduct;
      return { ...updatedProduct };
    }
  }

  return null;
}

function deleteProduct(productId) {
  for (const billId of Object.keys(tempProductStorage)) {
    const productIndex = tempProductStorage[billId].findIndex((item) => item.id === productId);

    if (productIndex >= 0) {
      const [deletedProduct] = tempProductStorage[billId].splice(productIndex, 1);

      if (tempProductStorage[billId].length === 0) {
        delete tempProductStorage[billId];
      }

      return { ...deletedProduct };
    }
  }

  return null;
}

module.exports = {
  getProductsForBill,
  clearProductsForBill,
  upsertProduct,
  updateProduct,
  deleteProduct,
};
