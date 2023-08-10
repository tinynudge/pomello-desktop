<script lang="ts">
  import Content from '@/app/ui/Content';
</script>

<div class="buttonsOverlay">
  <Content class="content"><slot /></Content>
  <div class="buttons">
    <slot name="buttons" />
  </div>
</div>

<style lang="scss">
  .buttonsOverlay {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;

    :global(.content) {
      flex: 1;
    }
  }

  .buttons {
    display: flex;
    height: 100%;
    flex-direction: column;
    border-left: 1px solid var(--app-divider);

    :global(button) {
      flex: 1;
      padding: 0 12px;
      border: 0;
      border-top: 1px solid var(--app-divider);
      background-color: var(--app-button-background);
      color: var(--app-content-default);
      font-size: 13px;

      &:hover,
      &:focus {
        background-color: var(--app-button-background-hover);
      }

      &:first-child {
        border-top: none;
      }
    }
  }
</style>
