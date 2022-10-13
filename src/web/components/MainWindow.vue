<template>
  <p class="display-3 fw-normal text-center">Poe Ninja Item Trader</p>

  <div class="row align-items-start">

    <div class="col">
      <ItemParser />
    </div>

    <div class="col">
      <Modifiers />
    </div>

  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ItemParser from './ItemParser.vue'
import Modifiers from './Modifiers.vue';

export default defineComponent({
  name: "MainWindow",
  components: {
    ItemParser,
    Modifiers
  }
})
</script>
