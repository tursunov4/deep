// useWindowWidth.js
import { ref, onMounted, onUnmounted, computed } from 'vue';

export function useWindowWidth() {
    const windowWidth = ref(window.innerWidth);

    const onWidthChange = () => {
        windowWidth.value = window.innerWidth;
    };

    onMounted(() => {
        window.addEventListener('resize', onWidthChange);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', onWidthChange);
    });

    const isDesktop = computed(() => {
        return windowWidth.value > 1100;
    });

    return {
        isDesktop,
    };
}
