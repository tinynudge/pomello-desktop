<div class="text"><slot /></div>

<style lang="scss">
  .text {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;

    @for $i from 0 through 10 {
      // Height of min window + base font size * line-height
      @media (min-height: (48px + (15px * 1.4 * $i))) {
        -webkit-line-clamp: 1 + $i;
      }
    }
  }
</style>
