<template>
    <div>
      <formp></formp>
      <v-dialog v-model="estados.formCierre" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Cerrar Caja</span>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveItem">
              
              <div>
                <span >Fecha:</span>
              <input type="date"   v-model="fecha" style="margin: 8px; background: black; color:antiquewhite;" />
              <v-icon icon="mdi-refresh" @click="refresh()"></v-icon>
            </div>
              
              <div style="display: flex; flex-direction: column;">
                <h3>
                  Ventas:  <span style=" color: #2aa541;">{{ estados.cierre.ventas.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }}</span>
              
                </h3>
                <h3>

                   Capital:<span style=" color: #ff7525;">{{(estados.cierre.ventas-estados.cierre.utilidad).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }}
                </span>
                  </h3>
                <h3>

                   Utilidades:<span style=" color: #ffe205;">{{ estados.cierre.utilidad.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }}
                </span>
                  </h3>
                <h3>
                   Gastos:<span style=" color: #fd5141;">{{estados.cierre.gastos.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }}
                  </span>
                  </h3>
                <h3>
                   Compras:<span style=" color: #c149bb;">{{estados.cierre.compras.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }}
                  </span>
                  </h3>
                <h3>
                   Caja:<span style="color: brown;"> {{(estados.cierre.ventas-(estados.cierre.gastos+estados.cierre.compras)).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }}</span>
                </h3>
                
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="estados.formCierre=false">Cancelar</v-btn>
            <v-btn color="blue darken-1" text @click="saveItem">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <script setup>
  import { ref, watch, computed } from "vue";
  import { useAppStore } from "../store/app";
  import formp from "@/components/FormProduct.vue";
  
  const estados = useAppStore();
  
 const fecha=ref('');

  ///GUARDAR FORMULARIO
  async function saveItem() {
estados.cerrar_caja(fecha.value);
  }

  async function refresh(){
    await estados.getVentas(fecha.value, fecha.value);
    await estados.getGastos(fecha.value, fecha.value);
   
  }


  watch(
  () => estados.formCierre,
  (newVal) => {
    if (newVal === false){

        fecha.value=estados.hoy()
    }

   
  }
);

  
 
  
  
  fecha.value=estados.hoy()
  </script>
  