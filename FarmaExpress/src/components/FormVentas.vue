<template>
  <div>
    <formp></formp>
    <v-dialog v-model="estados.formVenta.display" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Registrar Venta</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveItem">
            
            <div>
              <span >Fecha:</span>
            <input type="date"   v-model="venta.fecha" style="margin: 8px;" />
            </div>
            <v-text-field
              label="Producto"
              type="txt"
              v-model="venta.nombre"
              required
              readonly
            ></v-text-field>
            <v-text-field
              type="number"
              label="Precio"
              v-model="venta.precio"
              readonly
              required
            ></v-text-field>
            <v-text-field
              label="Cantidad"
              type="number"
              v-model="venta.cantidad"
              required
            ></v-text-field>
            <div style="display: flex">
              <h3>
                Total: <span style="margin-right: 12px">{{ total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }}</span
                >Utilidad:{{ utilidad.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }}
              </h3>
            </div>
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

const total = ref(0);
const utilidad = ref(0);
const editedItem = ref({
  nombre: null,
  unidades: null,
  stock: null,
  precio: null,
  precioi:null,
  costo: null,
  utitlidad: 0,
  recaudo: 0,
  fecha: "",
});

const venta = ref({
  id_almacen:null,
  nombre: "",
  cantidad: "",
  precio: "",
  costo: null,
  fecha: "",
});

///GUARDAR FORMULARIO
async function saveItem() {
 
/*
  const fechaArray = fechaString.split("-");
  venta.value.fecha = `${fechaArray[2]}/${fechaArray[1]}/${fechaArray[0]}`;
  */

  if (venta.value.cantidad == "") {
    alert("El campo cantidad no puede estar vacio");
    return;
  }
  
    venta.value.cantidad = parseFloat(venta.value.cantidad);
    venta.value.precio = parseFloat(editedItem.value.precio);
    venta.value.costo = parseFloat(venta.value.costo);
    estados.formAlmacen.display = false;
    await estados.addVenta(venta.value,editedItem.value);


   
}

///CANCELAR FORMULARIO
function cancelar() {
  estados.formVenta.display = false;

}
//EVITAR QUE SE INGRESE VALORES SUPERIORES AL STOCK
watch(
  () => venta.value.cantidad,
  (newVal) => {
    if (newVal === "") {
      total.value = 0;
      utilidad.value = 0;
      return;
    }
    if (newVal > editedItem.value.stock) {
      alert("La cantidad es superio a stock");
      venta.value.cantidad = "";
     utilidad.value = "";
      return;
    }

    total.value = venta.value.precio * newVal;
    utilidad.value = total.value - editedItem.value.costo * newVal;
  }
);
//PREPARA CUANDO ABRE EL FORMULARIO
watch(
  () => estados.formVenta,
  (newVal) => {
    if (newVal.display === false) return;

    venta.value.fecha=estados.hoy()
    const u = Object.assign({}, estados.edit);
    venta.value.id_almacen= u.id;
    venta.value.nombre = u.nombre;
    venta.value.precio = u.precio;
    venta.value.costo = u.costo;
    venta.value.cantidad=''
   
    editedItem.value = u;
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


venta.value.fecha=estados.hoy()
</script>
