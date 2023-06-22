<style scoped>
.scroll-y {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.v-col {
  display: flex;
  align-items: stretch;
  padding: 4px;
}

.v-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}


.v-card-title {
  font-size: 18px;
  font-weight: 600;
  margin-top: 8px;
  margin-bottom: 4px;
}

.v-card-text {
  font-size: 14px;
  line-height: 1.4;
}


</style>

<template>
  <v-app id="inspire" no-ssr-wrapper>
    <Drawer></Drawer>
    <Bar></Bar>
    <v-main style="background:#1e202c;">
      <div class="scroll-y" style="padding: 8PX;">
        <h3 app style="color: #6495ed;padding-bottom: 8px; text-align: center;">Dashboard/</h3>
       
  <v-container fluid>
    <v-row dense>
      <v-col
      v-for=" (item,index) in items"
      :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <v-card :color="item.color" class="d-flex flex-column" max-width="400" min-width="200">
          <div class="d-flex " style="align-items: center;">
            <div>
             <v-icon
              :icon="item.ico"
              size="80"
           style="color:rgb(31, 47, 61)"
             ></v-icon>
            </div>
            <div>


          <v-card-title class="text-h5" style="color: aliceblue;">{{ item.v.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}}</v-card-title>
          <v-card-text style="color: #ffffff; font-size: 22px;font-weight: bold; ">{{ item.titulo }}</v-card-text>
        </div>
        </div>
        </v-card>
        
      </v-col>
     
    </v-row>
  </v-container>


      </div>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

  <script setup>
  import { ref, watch, computed } from "vue";
  import Drawer from "@/components/Drawer.vue";
  import Bar from "@/components/Bar.vue";
  import Footer from "@/components/Footer.vue";
  import { useAppStore } from "../store/app";
  
const estados = useAppStore();

  const items=ref([
  {ico:'mdi-cash-register',color:'rgb(78, 165, 65)',titulo:'Caja mayor',v:estados.dataUser.capital_caja+estados.dataUser.utilidades_caja},
  {ico:'mdi-chart-line',color:'#deb51f',titulo:'Utilidad',v:estados.dataUser.utilidades_caja},
  {ico:'mdi-bank',color:'#e44d4d',titulo:'Capital_caja',v:estados.dataUser.capital_caja-estados.datosG.capital_producto},
  {ico:'mdi-package-variant-closed',color:'#706e6e',titulo:'Capital_producto',v:estados.dataUser.capital_producto},
    
    
   
  ])

watch(
  () => estados.dataUser,
  (newVal) => {
  
    items.value[0].v=newVal.capital_caja+newVal.utilidades_caja;
    items.value[1].v=newVal.utilidades_caja;
    items.value[2].v=newVal.capital_caja;
    items.value[3].v=newVal.capital_producto;

    
  }
);

watch(
  () => estados.datosG,
  (newVal) => {
  
   
    items.value[3].v=estados.datosG.capital_producto;
    
  }
);



  
  </script>