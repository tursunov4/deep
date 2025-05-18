<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import Slider from "@vueform/slider";

type IRange = [number | string, number | string];

const props = defineProps<{
  endValues: IRange;
  currentValues: IRange;
}>();
const rangeValue: Ref<[number | string, number | string]> = ref([0, 1000000]);
defineEmits(["range"]);

watch(
  props,
  () => {
    if (typeof props.currentValues[0] == "string") {
      rangeValue.value[0] = parseInt(props.currentValues[0]);
    } else rangeValue.value[0] = props.currentValues[0];
    if (typeof props.currentValues[1] == "string") {
      rangeValue.value[1] = parseInt(props.currentValues[1]);
    } else rangeValue.value[1] = props.currentValues[1];
  },
  { deep: true }
);
</script>

<template>
  <div>
    <Slider
      :lazy="false"
      :min="endValues[0]"
      :max="endValues[1]"
      :tooltips="false"
      @slide="$emit('range', rangeValue)"
      id="sldr"
      v-model="rangeValue"
    />
  </div>
</template>

<style>
:root {
  --slider-bg: #d1d5db;
  --slider-connect-bg: #ffffff;
  --slider-connect-bg-disabled: #9ca3af;
  --slider-height: 1px;
  --slider-vertical-height: 300px;
  --slider-radius: 0px;

  --slider-handle-bg: #fff;
  --slider-handle-border: 0;
  --slider-handle-width: 10px;
  --slider-handle-height: 10px;
  --slider-handle-radius: 0px;
  --slider-handle-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
  --slider-handle-shadow-active: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.42);
  --slider-handle-ring-width: 3px;
  --slider-handle-ring-color: #949494;

  --slider-tooltip-font-size: 0.875rem;
  --slider-tooltip-line-height: 1.25rem;
  --slider-tooltip-font-weight: 600;
  --slider-tooltip-min-width: 10px;
  --slider-tooltip-bg: #ffffff;
  --slider-tooltip-bg-disabled: #9ca3af;
  --slider-tooltip-color: #fff;
  --slider-tooltip-radius: 5px;
  --slider-tooltip-py: 2px;
  --slider-tooltip-px: 6px;
  --slider-tooltip-arrow-size: 5px;
  --slider-tooltip-distance: 3px;
}

@media screen and (max-width: 1100px) {
  :root {
    --slider-tooltip-bg: #000000;
    --slider-tooltip-bg-disabled: #000000;
    --slider-tooltip-color: #000000;
    --slider-bg: #e0e0e0;
    --slider-connect-bg: #000000;
    --slider-connect-bg-disabled: #000000;
    --slider-handle-bg: #000;
  }
}

.slider-target,
.slider-target * {
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  box-sizing: border-box;
  touch-action: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

.slider-target {
  position: relative;
}

.slider-base,
.slider-connects {
  height: 100%;
  position: relative;
  width: 100%;
  z-index: 1;
}

.slider-connects {
  overflow: hidden;
  z-index: 0;
}

.slider-connect,
.slider-origin {
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  -ms-transform-origin: 0 0;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform-style: preserve-3d;
  transform-style: flat;
  width: 100%;
  will-change: transform;
  z-index: 1;
}

.slider-txt-dir-rtl.slider-horizontal .slider-origin {
  left: 0;
  right: auto;
}

.slider-vertical .slider-origin {
  top: -100%;
  width: 0;
}

.slider-horizontal .slider-origin {
  height: 0;
}

.slider-handle {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  position: absolute;
}

.slider-touch-area {
  height: 100%;
  width: 100%;
}

.slider-state-tap .slider-connect,
.slider-state-tap .slider-origin {
  transition: transform 0.3s;
}

.slider-state-drag * {
  cursor: inherit !important;
}

.slider-tooltip-drag .slider-tooltip,
.slider-tooltip-focus .slider-tooltip {
  display: none !important;
}

.slider-tooltip-drag .slider-active .slider-tooltip,
.slider-tooltip-drag.slider-state-drag
  .slider-tooltip:not(.slider-tooltip-hidden),
.slider-tooltip-focus.slider-focused
  .slider-tooltip:not(.slider-tooltip-hidden) {
  display: none !important;
}

.slider-horizontal {
  height: var(--slider-height, 6px);
}

.slider-horizontal .slider-handle {
  height: var(--slider-handle-height, 16px);
  right: calc(var(--slider-handle-width, 16px) / 2 * -1);
  top: calc(
    (var(--slider-handle-height, 16px) - var(--slider-height, 6px)) / 2 * -1 +
      -1px
  );
  width: var(--slider-handle-width, 16px);
}

.slider-vertical {
  height: var(--slider-vertical-height, 300px);
  width: var(--slider-height, 6px);
}

.slider-vertical .slider-handle {
  bottom: calc(var(--slider-handle-width, 16px) / 2 * -1);
  height: var(--slider-handle-width, 16px);
  right: calc(
    (var(--slider-handle-height, 16px) - var(--slider-height, 6px)) / 2 * -1 +
      -1px
  );
  width: var(--slider-handle-height, 16px);
}

.slider-txt-dir-rtl.slider-horizontal .slider-handle {
  left: calc(var(--slider-handle-width, 16px) / 2 * -1);
  right: auto;
}

.slider-base {
  background-color: var(--slider-bg, #d1d5db);
}

.slider-base,
.slider-connects {
  border-radius: var(--slider-radius, 0px);
}

.slider-connect {
  background: var(--slider-connect-bg, #10b981);
  cursor: pointer;
}

.slider-draggable {
  cursor: ew-resize;
}

.slider-vertical .slider-draggable {
  cursor: ns-resize;
}

.slider-handle {
  background: var(--slider-handle-bg, #fff);
  border: var(--slider-handle-border, 0);
  border-radius: var(--slider-handle-radius, 9999px);
  cursor: -webkit-grab;
  cursor: grab;
  height: var(--slider-handle-height, 16px);
  width: var(--slider-handle-width, 16px);
}

.slider-handle:focus {
  outline: none;
}

.slider-active {
  cursor: -webkit-grabbing;
  cursor: grabbing;
}

[disabled] .slider-connect {
  background: var(--slider-connect-bg-disabled, #9ca3af);
}

[disabled] .slider-handle,
[disabled].slider-handle,
[disabled].slider-target {
  cursor: not-allowed;
}

[disabled] .slider-tooltip {
  background: var(--slider-tooltip-bg-disabled, #9ca3af);
  border-color: var(--slider-tooltip-bg-disabled, #9ca3af);
}

.slider-tooltip {
  display: none;
}

.slider-horizontal .slider-tooltip-top {
  bottom: calc(
    var(--slider-handle-height, 16px) + var(--slider-tooltip-arrow-size, 5px) +
      var(--slider-tooltip-distance, 3px)
  );
  left: 50%;
  transform: translate(-50%);
}

.slider-horizontal .slider-tooltip-top:before {
  border: var(--slider-tooltip-arrow-size, 5px) solid transparent;
  border-top-color: inherit;
  bottom: calc(var(--slider-tooltip-arrow-size, 5px) * -2);
  content: "";
  height: 0;
  left: 50%;
  position: absolute;
  transform: translate(-50%);
  width: 0;
}

.slider-horizontal .slider-tooltip-bottom {
  left: 50%;
  top: calc(
    var(--slider-handle-height, 16px) + var(--slider-tooltip-arrow-size, 5px) +
      var(--slider-tooltip-distance, 3px)
  );
  transform: translate(-50%);
}

.slider-horizontal .slider-tooltip-bottom:before {
  border: var(--slider-tooltip-arrow-size, 5px) solid transparent;
  border-bottom-color: inherit;
  content: "";
  height: 0;
  left: 50%;
  position: absolute;
  top: calc(var(--slider-tooltip-arrow-size, 5px) * -2);
  transform: translate(-50%);
  width: 0;
}

.slider-vertical .slider-tooltip-left {
  right: calc(
    var(--slider-handle-height, 16px) + var(--slider-tooltip-arrow-size, 5px) +
      var(--slider-tooltip-distance, 3px)
  );
  top: 50%;
  transform: translateY(-50%);
}

.slider-vertical .slider-tooltip-left:before {
  border: var(--slider-tooltip-arrow-size, 5px) solid transparent;
  border-left-color: inherit;
  content: "";
  height: 0;
  position: absolute;
  right: calc(var(--slider-tooltip-arrow-size, 5px) * -2);
  top: 50%;
  transform: translateY(-50%);
  width: 0;
}

.slider-vertical .slider-tooltip-right {
  left: calc(
    var(--slider-handle-height, 16px) + var(--slider-tooltip-arrow-size, 5px) +
      var(--slider-tooltip-distance, 3px)
  );
  top: 50%;
  transform: translateY(-50%);
}

.slider-vertical .slider-tooltip-right:before {
  border: var(--slider-tooltip-arrow-size, 5px) solid transparent;
  border-right-color: inherit;
  content: "";
  height: 0;
  left: calc(var(--slider-tooltip-arrow-size, 5px) * -2);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
}

.slider-horizontal .slider-origin > .slider-tooltip {
  left: auto;
  transform: translate(50%);
}

.slider-horizontal .slider-origin > .slider-tooltip-top {
  bottom: calc(
    var(--slider-tooltip-arrow-size, 5px) +
      (var(--slider-handle-height, 16px) - var(--slider-height, 6px)) / 2 +
      var(--slider-tooltip-distance, 3px) + 1px
  );
}

.slider-horizontal .slider-origin > .slider-tooltip-bottom {
  top: calc(
    var(--slider-tooltip-arrow-size, 5px) +
      (var(--slider-handle-height, 16px) - var(--slider-height, 6px)) / 2 +
      var(--slider-tooltip-distance, 3px) + var(--slider-height, 6px) - 1px
  );
}

.slider-vertical .slider-origin > .slider-tooltip {
  top: auto;
  transform: translateY(
    calc(
      (
          var(--slider-tooltip-line-height, 1.25rem) -
            var(--slider-tooltip-py, 2px)
        ) * -1 + 1px
    )
  );
}

.slider-vertical .slider-origin > .slider-tooltip-left {
  right: calc(
    var(--slider-tooltip-arrow-size, 5px) + var(--slider-height, 6px) +
      (var(--slider-handle-height, 16px) - var(--slider-height, 6px)) / 2 +
      var(--slider-tooltip-distance, 3px) - 1px
  );
}

.slider-vertical .slider-origin > .slider-tooltip-right {
  left: calc(
    var(--slider-tooltip-arrow-size, 5px) + var(--slider-height, 6px) +
      (var(--slider-handle-height, 16px) - var(--slider-height, 6px)) / 2 +
      var(--slider-tooltip-distance, 3px) - var(--slider-height, 6px) + 1px
  );
}
</style>
