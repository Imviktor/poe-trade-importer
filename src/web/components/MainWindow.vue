<template>
  <div class="container-lg">
    <p class="display-3 fw-normal text-center">Poe Ninja Item Trader</p>

    <div class="row justify-content-md-center">

      <div class="col-5">
        <ItemParser />
      </div>

      <div class="col-7">
        <Modifiers />
      </div>

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
