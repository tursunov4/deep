import {defineStore} from 'pinia'
import {Ref, ref} from "vue";
import {components} from "../types/schema";

export const CartStore = defineStore('cart', () => {
    type CartProduct = {
        amount: number,
        product: components["schemas"]["Product"]
    }

    let products: Ref<CartProduct[]> = ref([])

    function changeAmount(productId: number, plus?: boolean) {
        let product = products.value.findIndex(product => product.product.id === productId)
        if (product < 0) return
        if (plus) {
            products.value[product].amount += 1
        } else {
            products.value[product].amount -= 1
            if (products.value[product].amount < 1) {
                products.value.splice(product, 1)
            }
        }
    }

    function deleteProduct(productId: number) {
        let product = products.value.findIndex(product => product.product.id === productId)
        products.value.splice(product, 1)
    }

    function clearCart(){
        products.value = []
    }

    return {products, changeAmount, deleteProduct, clearCart}
}, {persist: true})
