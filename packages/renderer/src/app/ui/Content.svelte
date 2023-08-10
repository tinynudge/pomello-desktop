<script lang="ts">
  let className: string | undefined = undefined;
  export { className as class };
</script>

<div class={`content ${className ?? ''}`}>
  <slot />
</div>

<style lang="scss">
  .content {
    display: flex;
    overflow: hidden;
    height: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 8px;
  }
</style>
