<script lang="ts">
  export let isDisabled = false;
  export let isSelected = false;
  export let type: 'group' | 'item' = 'item';
</script>

<div
  class:group={type === 'group'}
  class:isDisabled
  class:isSelected
  class="row"
  data-row
  on:click
  on:mouseenter
  role="presentation"
  tabindex="-1"
  {...$$restProps}
>
  <slot />
</div>

<style lang="scss">
  .row {
    position: relative;
    display: flex;
    overflow: hidden;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    padding-left: calc(12px + (var(--row-depth) * 16px));
    list-style: none;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .group {
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: var(--select-background-group);
    font-size: 13px;
  }

  .isDisabled {
    color: var(--select-content-helper);
  }

  .isSelected {
    background-color: var(--select-background-selected);
  }
</style>
