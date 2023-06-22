<style>
.v-icon.red--text {
  color: rgb(224, 86, 86);
}

.v-icon.green--text {
  color: rgb(97, 187, 97);
}

.flex-conta {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: aqua;
}
.f {
  border: 1px solid rgb(122, 117, 117);
  margin: 0px;
  padding: 0px 8px;
  margin-left: 8px;
  border-radius: 10px;
  color: antiquewhite;
}
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
.f:hover {
  border: 3px solid rgb(66, 32, 23);
}


.container--full {
  width: 100%;
}

.container--half {
  width: 50%;
}
</style>

<template>
  <div style="max-width: 100%; overflow: hidden;" >
   
    

    <div style="max-width: 100%;">
    <v-row class="pa-8">
      <v-col cols="12" sm="4">
        <v-text-field
      v-model="search"
      label="Buscar por nombre o código"
      variant="outlined"
      append-inner-icon="mdi-magnify"
      density="compact"
      style="max-width: 550px; color: aqua; "
    />
    </v-col>
      <v-col cols="12" sm="4">
        <div class="flex-conta">
          <v-row>
            <v-col cols="12" sm="6">
              <span>Desde:</span><input type="date" class="f" v-model="filtrof.fechai" />
       
            </v-col>
            <v-col cols="12" sm="6">
              <span>Hasta:</span><input type="date" class="f" v-model="filtrof.fechaf" />
            </v-col>
       
      </v-row>
      </div>
    </v-col>
      <v-col cols="12" sm="4">
        <v-btn
        prepend-icon="mdi-filter"
        small
        class="m-auto mb-4 bg-indigo-lighten-1"

        @click="filtrara()"
      >
        <template v-slot:prepend>
          <v-icon color="white"></v-icon>
        </template>

        Filtrar

        <template v-slot:append> </template>
      </v-btn>
      </v-col>
    </v-row>
   </div>
  

    <!-- Agregar el diálogo/modal -->
    <formularioA></formularioA>

    <v-table
      dense
      :sort-by="'Codigo'"
      :sort-desc="false"
      theme="dark"
      style="border: 1px solid #767575"
    >
      <thead>
        <tr>
          <th class="text-left">Nombre</th>
          <th class="text-left">Fecha</th>
          <th class="text-left">Unidades</th>
          <th class="text-left">Costo/U</th>
          <th class="text-left">Precio venta/U</th>
          <th class="text-left">Total</th>
          <th class="text-left">Utilidad</th>
          <th class="text-left">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in displayedItems" :key="index">
          <td>{{ item.nombre }}</td>
          <td>{{ item.fecha }}</td>
          <td>{{ item.cantidad }}</td>
          <td>
            {{
              item.costo.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })
            }}
          </td>

          <td>
            {{
              item.precio.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })
            }}
          </td>
          <td>
            {{
              (item.cantidad * item.precio).toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })
            }}
          </td>
          <td>
            {{
              (
                item.cantidad * item.precio -
                item.cantidad * item.costo
              ).toLocaleString("es-CO", { style: "currency", currency: "COP" })
            }}
          </td>
          <td>
            <v-btn
              @click="estados.eliminarVenta(item)"
              prepend-icon="mdi-delete"
              class="bg-red-darken-3"
              small
            >
              <template v-slot:prepend>
                <v-icon color="white"></v-icon>
              </template>

              Elinimar

              <template v-slot:append> </template>
            </v-btn>
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
      style="border: 1px solid #767575; color: aqua"
    />
    <div style="max-width: 100%;">
    <v-row >
      <v-col cols="12" sm="4">
        <h1 class="mr-4" style="color:#bdbcba">
          Total:<span style="color: rgb(206, 90, 48)">{{
            estados.filtro.total.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })
          }}</span>
        </h1>
      </v-col>
      <v-col cols="12" sm="4">
        <h1 style="color:#bdbcba">
          Utilidad:<span style="color: rgb(48, 206, 82)">{{
            estados.filtro.utilidad.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })
          }}</span>
        </h1>
      </v-col>
    </v-row>
  </div>
  </div>

  
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useAppStore } from "../store/app";
//import { useRouter } from "vue-router";

const estados = useAppStore();
import FormularioA from "@/components/FormAlmacen.vue";

const currentPage = ref(1);
const itemsPerPage = ref(20);
const search = ref("");
const desserts = ref(estados.ventas);

const filtrof = ref({
  fechai: "",
  fechaf: "",
});

function filtrara() {
  if (!esMismoMes(filtrof.value.fechai, filtrof.value.fechaf)) {
    alert("Solo puedes filtrar el contenido de un solo mes en especifico");
    return;
  }
  console.log(filtrof.value.fechai + "/" + filtrof.value.fechaf);
  if (filtrof.value.fechai > filtrof.value.fechaf) {
    alert(
      "Rango de fecha invalido: quizas la fecha final es inferior a la fecha inicial"
    );
    return;
  }
  estados.getVentas(filtrof.value.fechai, filtrof.value.fechaf);
}

function esMismoMes(fecha1, fecha2) {
  const date1 = new Date(fecha1);
  const date2 = new Date(fecha2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
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
  return desserts.value.filter(
    (item) => regex.test(item.nombre) || regex.test(item.codigo)
  );
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

watch(
  () => estados.ventas,
  (newVal, oldVal) => {
    desserts.value = newVal;
  }
);

filtrof.value.fechai = estados.hoy();
filtrof.value.fechaf = estados.hoy();
</script>
