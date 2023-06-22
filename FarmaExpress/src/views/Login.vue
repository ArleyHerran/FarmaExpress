<template>
  <v-container fluid class="fill-height" style="background:#1e202c;">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="mx-auto" max-width="300">
          <v-card-title>
            <span class="text-h5">Drogeriasf</span>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="credenciales.username"
                label="Usuario"
                prepend-icon="mdi-account"
                variant="outlined"
                density="compact"
              ></v-text-field>
              <v-text-field
                v-model="credenciales.password"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña"
                prepend-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                variant="outlined"
                density="compact"
                @click:append-inner="showPassword = !showPassword"
              ></v-text-field>
              <v-btn color="primary" v-on:click="estados.login(credenciales.username, credenciales.password)">Iniciar sesión</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
//import{auth} from '../confiFirebase'

  import { useAppStore } from "../store/app";
  import { ref,onMounted } from 'vue';
 
//df
  const estados = useAppStore();
  const credenciales = ref({
    username: '',
    password: '',
  });

  const showPassword = ref(false);

  onMounted(() => {
  // Llamar la acción aquí
 
});
</script>

  