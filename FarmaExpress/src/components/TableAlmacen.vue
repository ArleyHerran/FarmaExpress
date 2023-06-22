<style>
.v-icon.red--text {
  color: rgb(224, 86, 86);
}

.v-icon.green--text {
  color: rgb(97, 187, 97);
}
</style>

<template>
  <div>
    <v-text-field
      v-model="search"
      label="Buscar por nombre o código"
      variant="outlined"
      append-inner-icon="mdi-magnify"
      density="compact"
      style="max-width: 550px; color:aqua;"
    />
    <v-btn color="primary" class="mb-5" fab dark @click="estados.opnenFormAlmacen({display:true,f:1,},null)">
      <v-icon>mdi-plus</v-icon>
      Agregar al almacen
    </v-btn>
    <!-- Agregar el diálogo/modal -->
    <formularioA></formularioA>
    <formularioB></formularioB>
    <v-dialog v-model="dialog" max-width="300px">
      <v-card>
        <v-card-title>
        
            <h3>Editar</h3>
          
         
        </v-card-title> 
      <v-card-text> <v-text-field
              type="number"
              label="Valor"
              v-model="newv"
              required
            ></v-text-field></v-card-text>
           <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="cancelar()">Cancelar</v-btn>
          <v-btn color="primary" @click="guardar()">Guardar</v-btn>
           </v-card-actions> 
     
      </v-card>
    </v-dialog>

    <v-table dense hover   :sort-by="'Codigo'" :sort-desc="false" theme="dark" style="border: 1px solid #767575;">
      <thead>
        <tr>
          <th class="text-left">Nombre</th>
          <th class="text-left" >Fecha.........</th>
          <th class="text-left">Unidades</th>
          <th class="text-left">Costo/Unidad</th>
          <th class="text-left">Costo/total</th>
          <!--
          <th class="text-left">Utilidades</th>
         -->
          <th class="text-left">Stock/Us</th>
          <th class="text-left">Precio/venta</th>   
           <th class="text-left">Utilidad/Unidad</th>
            <!--
          <th class="text-left">Utilidad/restante</th>
          -->
          <th class="text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in displayedItems" :key="index">
          <td>{{ item.nombre }}</td>
          <td>{{item.fecha}}</td>
          <td>{{item.unidades}}</td>
          <td>{{(item.costo).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}}</td>
          <td>{{(item.unidades*item.costo).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}}</td>
           <!--
          <td>{{((item.precioi*item.unidades)-(item.unidades*item.costo)).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}}</td>
        -->
          <td>{{item.stock}}</td>
          <td style=" color:rgb(252, 46, 46); cursor:pointer;" @click="openEdit(item)">{{item.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}}</td>
          <td style=" color:rgb(129, 211, 114);">{{((item.precio)-(item.costo)).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}}</td>
          <!--
          <td>{{((item.precio*item.stock)-(item.stock*item.costo)).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}}</td>
          -->
          <td>
            <div style="display: flex; align-items: center;">
    <v-icon style="margin-right: 8px;" color="red" @click="estados.eliminarAlmacen(item)">mdi-delete</v-icon>

    <v-btn style="padding: 0px 4px; text-transform: none; font-size: 12px;"  color="green" small @click="estados.opnenFormVenta({display:true},item)">Vender</v-btn>

  </div>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      :total-visible="5"
      :ellipsis="null"
      :boundary-links="false"
      @input="changePage"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
      style="border: 1px solid #767575; color: aqua;"
    />

    <div style="font-size: 22px;">
              <span style="color: aqua;" >Fecha:</span>
            <input type="date"   v-model="compra.fecha" style="margin: 8px;  padding:0px 8px ; background: rgb(195, 185, 185); color: rgb(23, 22, 21);" />
            <v-btn @click="calcular()">Calcular compra</v-btn>
          </div>
    

    <h2 style="color: rgb(205, 207, 207);">Total: <span style="color:rgb(71, 239, 125)">{{ compra.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }}</span> </h2>

  </div>
</template>

<script setup>
import { ref, computed, watch} from 'vue';
import { useAppStore } from "../store/app";
//import { useRouter } from "vue-router";

const estados = useAppStore();
import FormularioA from "@/components/FormAlmacen.vue";
import FormularioB from "@/components/FormVentas.vue";
const compra = ref({fecha:'',total:0});
const currentPage = ref(1);
const itemsPerPage = ref(20);
const search = ref('');
const dialog = ref(false);
const desserts = ref(estados.almacen);
const newv=ref('')
const vali=ref('')
const producs={};
function openEdit(p){
  producs.value= Object.assign({}, p);
  newv.value=p.precio
  vali.value=p.precio
  dialog.value=true;
}
async function guardar(p){
  if(!newv){alert("Ingrese un valor");return;}
 await estados.editarAlmacen(producs.value,newv.value)
 cancelar()

}


function cancelar(){
  dialog.value=false;
  newv.value=''

}

const sortedItems = computed(() => {
  return filteredDesserts.value.sort((a, b) => {
    if (a.codigo < b.codigo) {
      return -1;
    }
    if (a.codigo > b.codigo) {
      return 1;
    }
    return 0;
  });
});


const filteredDesserts = computed(() => {
  currentPage.value = 1;
  const regex = new RegExp(search.value, "i");
  return desserts.value.filter(item => regex.test(item.nombre) || regex.test(item.codigo));
});


const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value);
});
const displayedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedItems.value.slice(start, end);
});

const totalItems = computed(() => filteredDesserts.value.length);

function changePage(page) {
  currentPage.value = page;
}



watch(() => estados.almacen, (newVal, oldVal) => {
  desserts.value = newVal;
});

compra.value.fecha=estados.hoy()

function calcular(){
 console.log(compra.value.fecha);
 if (estados.almacen.length===0){alert('No hay compras en esta fecha:');return;}
  compra.value.total=estados.almacen.reduce((acomulador,objeto )=>{
    if(objeto.fecha===compra.value.fecha){
     const resul=objeto.costo*objeto.unidades;
    return acomulador+resul;
    }
    return acomulador;
  },0);
  console.log(compra.value.total)
}

</script>
