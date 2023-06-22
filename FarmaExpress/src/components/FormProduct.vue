<template>
  <div>
    <v-dialog v-model="estados.$state.formLabs" max-width="300px">
      <v-card>
        <v-card-title>
          <span class="headline">Agregar laboratorio/marca</span>
        </v-card-title>
        <v-card-text>
          <v-form
            validate-on="submit"
            @submit.prevent="saveLabs"
          >
            <v-text-field
              label="Nombre"
              v-model="labs"
              required
              :rules="[
                (value) => !!value || 'Este campo es requerido.',
                (value) =>
                  (value && value.length >= 2 && value.length <= 150) ||
                  'El nombre debe tener entre 2 y 150 caracteres.',
              ]"
            ></v-text-field>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="estados.$state.formLabs = false"
                >Cancelar</v-btn
              >
              <v-btn color="blue darken-1" text type="submit">Guardar</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="estados.formProducto.display" max-width="500px" >
      <v-card>
        <v-card-title>
          <span class="headline">{{ titulo}}</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveItem">
            <v-text-field
              label="Código"
              v-model="editedItem.codigo"
              readonly
              required
            ></v-text-field>
            <v-text-field
              label="Nombre"
              v-model="editedItem.nombre"
              required
            ></v-text-field>
            <v-autocomplete
              v-model="editedItem.labs"
              :items="estados.$state.dataLabs"
              label="Labs/marca"
              outlined
              allow-custom-value
              ><template #append>
                <v-btn icon @click="estados.$state.formLabs=true">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template></v-autocomplete
            >

           
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
import { ref,watch } from 'vue';
import { useAppStore } from "../store/app";

const estados = useAppStore();
const titulo  = ref("Agregar producto");
const labs = ref("");
const editedItem = ref( {
      codigo:null,
      nombre:null,
      labs: null,
    
    });
//
 async function saveItem() {

  const d = Object.assign({}, editedItem.value);

  if(!d.nombre){alert("Debes poner un nombre  del producto");return;}
  if(!d.labs){alert("Debes ingresar laboratorio o marca, o poner  (No aplica) en caso que no sea necesario");return;}
  if(titulo.value==="Agregar producto"){
    await estados.addProductos(d);
    alert('Registro guardado');
    estados.formProducto.display=false
    limpiar();
  }else{
     estados.editarProducto(d);
     estados.formProducto.display=false
     limpiar();
  }
 
 
 }

function saveLabs() {
  if (labs.value === '' || labs.value.length > 100) {
    alert('Error: el valor de labs no puede estar vacío ni tener más de 100 caracteres.');
    labs.value='';
    return;
  }
 estados.addLabs({nombre:labs.value});
 labs.value='';
}

function cancelar(){
 estados.formProducto.display=false;
limpiar();
}

watch(() => estados.formProducto, (newVal) => {
if(newVal.f===1){
titulo.value='Agregar producto'
limpiar();
}else{
  titulo.value='Editar producto'
  const u = Object.assign({}, estados.edit);
  editedItem.value=u;
  
}

});

function limpiar(){
editedItem.value.codigo=estados.dataUser.codigo;
editedItem.value.nombre='';
editedItem.value.labs='';


}

</script>

