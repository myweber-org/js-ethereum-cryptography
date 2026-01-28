
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

class ShoppingCart {
    private items: CartItem[] = [];

    addItem(item: CartItem): void {
        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.items.push({ ...item });
        }
    }

    removeItem(itemId: number): void {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    updateQuantity(itemId: number, newQuantity: number): void {
        const item = this.items.find(i => i.id === itemId);
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
        } else if (item && newQuantity <= 0) {
            this.removeItem(itemId);
        }
    }

    calculateTotal(): number {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItems(): CartItem[] {
        return [...this.items];
    }

    clearCart(): void {
        this.items = [];
    }
}

const cart = new ShoppingCart();

cart.addItem({ id: 1, name: "Laptop", price: 999.99, quantity: 1 });
cart.addItem({ id: 2, name: "Mouse", price: 25.50, quantity: 2 });
cart.addItem({ id: 1, name: "Laptop", price: 999.99, quantity: 1 });

console.log("Cart items:", cart.getItems());
console.log("Total:", cart.calculateTotal());

cart.updateQuantity(2, 1);
console.log("After updating mouse quantity:", cart.getItems());
console.log("New total:", cart.calculateTotal());

cart.removeItem(1);
console.log("After removing laptop:", cart.getItems());

cart.clearCart();
console.log("After clearing cart:", cart.getItems());