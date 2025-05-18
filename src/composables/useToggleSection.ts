// useToggleSection.ts
export function useToggleSection() {
    function toggleSection(element: HTMLElement | undefined) {
        if (!element) return;
        console.log(element);

        // Check if the element is currently collapsed
        const isCollapsed = element.getAttribute('data-collapsed') === 'true';

        if (isCollapsed) {
            // Expanding the section
            element.style.height = '0px';
            element.style.transition = 'height 0.3s ease'; // Ensure the transition is set

            // Trigger a reflow to ensure the height change is noticed by the browser
            element.offsetHeight; // This forces the browser to recognize the change

            // Set the height to the element's scroll height to expand it
            const sectionHeight = element.scrollHeight;
            element.style.height = sectionHeight + 'px';

            function transitionEndHandler() {
                if (!element) return;
                element.removeEventListener('transitionend', transitionEndHandler);
                element.style.height = '';
                element.style.transition = '';
            }

            element.addEventListener('transitionend', transitionEndHandler);
            element.setAttribute('data-collapsed', 'false');
        } else {
            // Collapsing the section
            const sectionHeight = element.scrollHeight;
            const elementTransition = element.style.transition;
            element.style.transition = '';

            requestAnimationFrame(() => {
                element.style.height = sectionHeight + 'px';
                element.style.transition = elementTransition;

                requestAnimationFrame(() => {
                    element.style.height = '0px';
                });
            });

            element.setAttribute('data-collapsed', 'true');
        }
    }

    return {
        toggleSection,
    };
}
