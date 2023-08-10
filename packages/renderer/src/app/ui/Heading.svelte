<h1 class="heading">
  <slot />
</h1>

<style lang="scss">
  .heading {
    overflow: hidden;
    width: 100%;
    color: var(--app-heading-default);
    font-family: Nunito, sans-serif;
    font-size: 10px;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
  }
</style>
