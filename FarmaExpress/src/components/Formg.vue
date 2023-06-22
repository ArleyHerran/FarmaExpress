<template>
  <div>
    <formp></formp>
    <v-dialog v-model="estados.formGasto" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Registrar salida</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveItem">
            <h3>Utilidades: <span style="color: rgb(78, 206, 101);">{{estados.dataUser.utilidades_caja.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}}</span></h3>
            <h3>Capital: <span style="color: rgb(221, 82, 82);">{{estados.dataUser.capital_caja.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}}</span></h3>
           
            <div>
              <span >Fecha:</span>
            <input type="date"   v-model="gasto.fecha" style="margin: 8px; padding: 0px 8px;  background: rgb(26, 25, 25); color:antiquewhite" />
            </div>
            <v-select
            v-model="gasto.tipo"
            label="Tipo"
            :items="['Gasto','Compra']"
            ></v-select>
            <v-select
            v-model="gasto.salidaD"
            label="Salida de:"
            :items="['Utilidades','Capital']"
            ></v-select>
  
            <v-text-field
              type="number"
              label="Valor"
              v-model="gasto.valor"
             
              required
            ></v-text-field>
            <v-textarea v-model="gasto.descripcion" label="Descripcion" variant="outlined" max-length="250" counter="250"/>
           
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelar()">Cancelar</v-btn>
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


const gasto = ref({
  descripcion: '',
  valor:'',
  fecha: "",
  tipo:'',
  salidaD:''
});

///GUARDAR FORMULARIO
async function saveItem() {

  if (!gasto.value.valor||!gasto.value.descripcion||!gasto.value.fecha ||!gasto.value.tipo||!gasto.value.salidaD) {
    alert("Hay algun campo vacio");
    return;
  }
    gasto.value.valor = parseFloat(gasto.value.valor);
   estados.addGasto(gasto.value) 

   
}

///CANCELAR FORMULARIO
function cancelar() {
  estados.formGasto = false;
}

//PREPARA CUANDO ABRE EL FORMULARIO
watch(
  () => estados.formGasto,
  (newVal) => {
    if (newVal === false) return;

   gasto.value.fecha=estados.hoy()
    gasto.value.valor ='';
    gasto.value.tipo ='';
    gasto.value.salidaD ='';
    gasto.value.descripcion = '';
    
  }
);



function obtenerContenido(parentesis) {
  const regex = /\((.*?)\)/; // Expresión regular para buscar texto entre paréntesis
  const match = parentesis.match(regex); // Buscar coincidencia en la variable
  if (match) {
    return match[1]; // Si se encontró coincidencia, devolver el contenido entre paréntesis
  } else {
    return null; // Si no se encontró coincidencia, devolver nulo
  }
}
gasto.value.fecha=estados.hoy();

</script>
