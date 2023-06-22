<template >
     <v-app-bar  color="teal-darken-4"
      image="https://picsum.photos/1920/1080?random">

      <template v-slot:image>
        <v-img
          gradient="to top right, rgba(10,10,11,1), rgba(20,20,11,.9)"
        ></v-img>
      </template>
      <v-app-bar-nav-icon @click="estados.drawer = !estados.drawer"></v-app-bar-nav-icon>

      <v-toolbar-title style="">RxMaster</v-toolbar-title>

      <v-spacer></v-spacer>
     <v-btn variant="outlined" @click="estados.formCierre=true">Cerrar Caja</v-btn>
     <!--
     

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
      -->
         </v-app-bar>
         <form-cierre></form-cierre>
</template>
<script setup>
import { useAppStore  } from '../store/app'
import FormCierre from '@/components/FormCierre.vue'
const estados = useAppStore();


</script>

