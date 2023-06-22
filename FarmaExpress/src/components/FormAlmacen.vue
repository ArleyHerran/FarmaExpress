<template>
    <div>
      
      <formp></formp>
      <v-dialog v-model="estados.formAlmacen.display" max-width="500px" >
        <v-card>
          <v-card-title>
            <span class="headline">{{ titulo}}</span>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveItem">
             
              <div>
              <span >Fecha:</span>
            <input type="date"   v-model="editedItem.fecha" style="margin: 8px;  padding:0px 8px ; background: rgb(195, 185, 185); color: rgb(23, 22, 21);" />
            </div>

              <v-autocomplete
                v-model="editedItem.nombre"
                v-model:search="search"
                :items="items"
                label="Producto"
                outlined
                allow-custom-value
                ><template #append>
                  <v-btn icon @click="estados.opnenFormProduto({display:true,f:1,},null)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template></v-autocomplete>
              <v-text-field
                label="Unidades"
                type="number"
                v-model="editedItem.unidades"
                required
              ></v-text-field>
              <v-text-field
              type="number"
                label="Costo  X unidad"
                v-model="editedItem.costo"
                required
              ></v-text-field>
              <v-text-field
                label="Precio de venta"
                type="number"
                v-model="editedItem.precio"
                required
              ></v-text-field>
   
                         </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelar()"
              >Cancelar</v-btn
            >
            <v-btn color="blue darken-1" text @click="saveItem">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <script setup>
  import { ref,watch,computed } from 'vue';
  import { useAppStore } from "../store/app";
  import formp from "@/components/FormProduct.vue"

  const estados = useAppStore();
  
  
  const titulo  = ref("Agregar al almacen");
  const codigo=ref("")
  const editedItem = ref( {
        nombre:null,
        unidades:null,
        stock: null,
        precio:null,
        precioi:null,
        costo: null,
        utitlidad:0,
        recaudo:0,  
        fecha:''
    
      });
  
      ///GUARDAR FORMULARIO
   async function saveItem() {
   

    if(!editedItem.value.nombre){alert('El campo Producto no puede estar vacio');return;}
    if (!editedItem.value.unidades || !editedItem.value.costo || !editedItem.value.precio) {
alert('Debe completar todos los campos');
return;
} else {
  editedItem.value.unidades = parseFloat(editedItem.value.unidades);
  editedItem.value.costo = parseFloat(editedItem.value.costo);
  editedItem.value.precio = parseFloat(editedItem.value.precio);
  editedItem.value.precioi = parseFloat(editedItem.value.precio);
  editedItem.value.stock=+editedItem.value.unidades;
}


  
    
    const d = Object.assign({}, editedItem.value);

    if(titulo.value==="Agregar al almacen"){
      estados.formAlmacen.display=false;
      
     
      await estados.addAlmacen(d);
      
     
      limpiar();
    }else{
       estados.editarProducto(d);
       estados.formProducto.display=false
       limpiar();
    }
   
   
   }
  
 ///CANCELAR FORMULARIO
  function cancelar(){
   estados.formAlmacen.display=false;
  limpiar();
  }
  
  watch(() => estados.formAlmacen, (newVal) => {
  
  if(newVal.f===1){
  titulo.value='Agregar al almacen'
  }
  
  });
  
  function limpiar(){
  editedItem.value.nombre='';
  editedItem.value.unidades='';
  editedItem.value.stock='';
  editedItem.value.precio='';
  editedItem.value.costo='';
  editedItem.value.utilidad='';
  editedItem.value.recaudo='';
  
  }

  function obtenerContenido(parentesis) {
  const regex = /\((.*?)\)/; // Expresión regular para buscar texto entre paréntesis
  const match = parentesis.match(regex); // Buscar coincidencia en la variable
  if (match) {
    return match[1]; // Si se encontró coincidencia, devolver el contenido entre paréntesis
  } else {
    return null; // Si no se encontró coincidencia, devolver nulo
  }
}


const formatDate = (date) => {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
};

const formattedDate = computed(() => formatDate(new Date()));
editedItem.value.fecha=formattedDate.value

////////////////////////////////////////////////////////////////////////////////////////////////////////
const items =ref([]);

const search=ref(null);
watch(() => search.value, (newVal) => {

if(newVal==''){items.value=estados.productos.map((item) => `#${item.codigo}_${item.nombre}_${item.labs}`).slice(0,20);return;}
  //items.value=estados.productos.map((item) => `#${item.codigo}_${item.nombre}_${item.labs}`)
 //console.log(newVal.toLowerCase());
  const fil = estados.productos.filter((item) =>
    formatItemText(item).toLowerCase().includes(newVal.toLowerCase())
  ).slice(0, 30);
 
   items.value =fil.map((item) => `#${item.codigo}_${item.nombre}_${item.labs}`).slice(0,30);;

  });


  
  

function formatItemText(item) {
  // Debes definir la lógica para formatear el texto del elemento según tus necesidades
 
  return `#${item.codigo}_${item.nombre}_${item.labs}`;
}
  

  </script>
  
  