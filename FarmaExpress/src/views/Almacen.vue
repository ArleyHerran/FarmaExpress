<template>
    <v-app id="inspire" no-ssr-wrapper>
      <Drawer></Drawer>
      <Bar></Bar>
      <v-main style="background:#1e202c;">
        <div class="scroll-y" style="padding: 8PX;">
          <h3 app style="color: cornflowerblue;padding-bottom: 8px; text-align: center;">Almacen/</h3>
         <Almacen/>
        </div>
      </v-main>
      <Footer></Footer>
    </v-app>
  </template>
  
  <style scoped>
  .scroll-y {
    max-height: calc(100vh - 120px);
    overflow-y: auto;
  }
  </style>
  
  <script setup>
  import Drawer from "@/components/Drawer.vue";
  import Bar from "@/components/Bar.vue";
  import Footer from "@/components/Footer.vue";
  import Almacen from "@/components/TableAlmacen.vue";
  </script>
  
  
  