// Utilities

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  runTransaction,
  endAt,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import { auth, db } from "../confiFirebase";
import { defineStore } from "pinia";

import { useRouter } from "vue-router";

export const useAppStore = defineStore("app", {
  state: () => ({
    //
    user: null,
    getData: null,
    dataUser: {
      imgProfile: "",
      nombre: "",
      capital_caja: 0,
      utilidades_caja: 0,
      capital_producto: 0,
    },
    datosG:{
      capital_caja:0,
      capital_producto:0
    },
    drawer: false,
    formProducto: { display: false, f: 0 },
    formAlmacen: { display: false, f: 0 },
    formVenta: { display: false, f: 0 },
    formGasto: false,
    formCierre: false,
    edit: null,
    formLabs: false,

    productos: [],
    almacen: [],
    ventas: [],
    gastos: [],
    dataLabs: [],
    filtrog: 0,
    filtro: {
      total: 0,
      utilidad: 0,
    },
    cierre:{
      gastos:0,
      compras:0,
      ventas:0,
      utilidad:0,
      fecha:""
    },
    configDialog: false,
  }),
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    login(email, password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in

          const user = userCredential.user;
          localStorage.setItem("usuario", JSON.stringify(userCredential));
          // ...
          alert("Accseso exitoso");
          location.reload();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert("Error al acceder " + errorMessage);
        });
    },
    userobserver() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          if (this.getData == null) {
            this.getData = true;
            this.config(uid);
            this.getLabs();
            this.getProductos();
            this.getAlmacen();
            this.getGastos(this.hoy(), this.hoy());
            this.getVentas(this.hoy(), this.hoy());
          }
          // ...
        } else {
          // User is signed out
          // ...
          this.getData = null;

          console.log("no login");
        }
      });
    },

    logout() {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          localStorage.setItem("usuario", null);
          this.getData = null;
          location.reload();
        })
        .catch((error) => {
          // An error happened.
          alert("Error al salir " + errorMessage);
        });
    },
    async config(id) {
      const unsub = onSnapshot(doc(db, "userData", id), (doc) => {
        //console.log("Current data: ", doc.data());
        this.dataUser = doc.data();
      });
    },
    async addLabs(labs) {
      try {
        const docRef = await addDoc(collection(db, "labs"), labs);
        //console.log("Document written with ID: ", docRef.id);
        this.formLabs = false;
      } catch (error) {
        // console.error("Error adding document: ", error);
        this.formLabs = false;
      }
    },

    getLabs() {
      const q = query(collection(db, "labs"), where("nombre", "!=", ""));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const labs = [];
        querySnapshot.forEach((doc) => {
          labs.push(doc.data().nombre);
        });
        this.dataLabs = labs;
        //console.log(labs);
      });
    },
    // Función para agregar un nuevo producto a la colección "productos"
    opnenFormProduto(d, ob) {
      if (d.f === 1) {
      }
      {
        this.edit = ob;
      }
      this.formProducto = d;
    },
    async addProductos(producto) {
      try {
        await runTransaction(db, async (transaction) => {
          const docRef = await setDoc(
            doc(db, "Productos", producto.codigo),
            producto
          );
          const confiRef = doc(db, "userData", this.dataUser.id);
          let numero = parseInt(this.dataUser.codigo, 10); // convierte el string a número
          numero++; // incrementa el número
          let nuevoNumeroString = numero.toString().padStart(3, "0");
          transaction.update(confiRef, { codigo: nuevoNumeroString });
        });
        return true;
      } catch (e) {
        alert("Ocurrio un error :", e);
        return false;
      }
    },
    async eliminarProducto(v) {
      if (confirm("¿Estás seguro que deseas eliminar este producto?")) {
        const docRef = await doc(db, "Productos", v);
        try {
          await deleteDoc(docRef);
          alert("Eliminado");
        } catch (error) {
          console.error("Error eliminando el documento: ", error);
        }
      }
    },

    async editarProducto(producto) {
      try {
        await runTransaction(db, async (transaction) => {
          await setDoc(doc(db, "Productos", producto.codigo), producto);
        });
        alert("Cambios guardados con exito");
      } catch (e) {
        alert("Ocurrio un error :", e);
      }
    },
    async getProductos() {
      const q = query(collection(db, "Productos"), where("codigo", "!=", ""));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const productos = [];
      
        querySnapshot.forEach((doc) => {
          productos.push(doc.data());
        
        });
        this.productos = productos;
       
      });
    },

    //AGREGAR ALMACEN
    opnenFormAlmacen(d, ob) {
      if (d.f === 1) {
      }
      {
        this.edit = ob;
      }
      this.formAlmacen = d;
    },
    async addAlmacen(p) {
      const confiRef = doc(db, "userData", this.dataUser.id);
      try {
        await runTransaction(db, async (transaction) => {
          const c = this.dataUser.capital_producto + p.unidades * p.costo;
          const d = this.dataUser.capital_caja - p.unidades * p.costo;
         
          const docRef = await addDoc(collection(db, "Almacen"), p);

          transaction.update(confiRef, {
            capital_producto: c,
           
          
          });
        });

        alert("Registro guardado");
        return true;
      } catch (e) {
        alert("Ocurrio un error :", e);
        return false;
      }
    },
    async editarAlmacen(p,n) {
      if (confirm("¿Estás seguro que deseas modificar el precio de este producto?")) {
        const docRef = await doc(db, "Almacen", p.id);
        //const confiRef = doc(db, "userData", this.dataUser.id);
        try {
          await runTransaction(db, async (transaction) => {
            transaction.update(docRef, {
              precio: +n,
             
            });
          });
          alert("Precio de producto cambiado")
         
        } catch (error) {
          alert("Error al cambiar el precio")
        }
      }
    },
    async getAlmacen() {
      const q = query(collection(db, "Almacen"), where("stock", ">", 0));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const alma = [];
      
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Si el campo "id" no está definido, lo agregamos usando el ID del documento
          if (!data.id) {
            data.id = doc.id;
          }
          alma.push(data);
         
        });
        this.almacen = alma;
      
      });
    },

    async eliminarAlmacen(p) {
      if (confirm("¿Estás seguro que deseas eliminar este producto?")) {
        const docRef = await doc(db, "Almacen", p.id);
        const confiRef = doc(db, "userData", this.dataUser.id);
        try {
          await runTransaction(db, async (transaction) => {
            await deleteDoc(docRef);
            const c_p = this.dataUser.capital_producto - p.stock * p.costo;
            transaction.update(confiRef, {
              capital_producto: c_p,
            
            });
          });
          return true;
          alert("Eliminado");
        } catch (error) {
          console.error("Error eliminando el documento: ", error);
        }
      }
    },

    //VENTAS
    opnenFormVenta(d, ob) {
      this.edit = ob;
      this.formVenta = d;
    },
    async addVenta(p, d) {
      this.formVenta.display = false;
      const confiRef = doc(db, "userData", this.dataUser.id);
      const docVRef = doc(db, "Almacen", d.id);
      try {
        await runTransaction(db, async (transaction) => {
          const costo = p.cantidad * p.costo;

          const c_c = this.dataUser.capital_caja + costo;
          const c_p = this.dataUser.capital_producto - costo;
          const u_c =
            this.dataUser.utilidades_caja + (p.cantidad * p.precio - costo);

          
          const docRef = await addDoc(collection(db, "Ventas"), p);

          await transaction.update(confiRef, {
            capital_producto: c_p,
            capital_caja: c_c,
            utilidades_caja: u_c,
           
          });
          await transaction.update(docVRef, {
            stock: d.stock - p.cantidad,
            recaudo:d.recaudo+(d.precio*p.cantidad),
           
          });
        });

        alert("Registro guardado");
        return true;
      } catch (e) {
        alert( e);
        return false;
      }
    },
    async getVentas(fi, ff) {
      const q = query(
        collection(db, "Ventas"),
        where("fecha", ">=", fi),
        where("fecha", "<=", ff)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const alma = [];
        this.filtro.total = 0;
        this.filtro.utilidad = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Si el campo "id" no está definido, lo agregamos usando el ID del documento
          if (!data.id) {
            data.id = doc.id;
          }
          alma.push(data);

          this.filtro.total += data.cantidad * data.precio;
        
          this.filtro.utilidad +=
            data.cantidad * data.precio - data.cantidad * data.costo;
        });
        this.cierre.ventas=this.filtro.total;
        this.cierre.utilidad=this.filtro.utilidad;
        this.ventas = alma;
      });
    },
    async eliminarVenta(p) {
      if (confirm("¿Estás seguro que deseas eliminar esta venta?")) {
        const docRef = await doc(db, "Almacen", p.id_almacen);
        const docRefV = await doc(db, "Ventas", p.id);
        const confiRef = await doc(db, "userData", this.dataUser.id);

        try {
          await runTransaction(db, async (transaction) => {
            const docAlmacen = await getDoc(docRef);
            if (!docAlmacen.exists()){alert("Imposible Eliminar: No existe un producto asociado a esta venta");return;}
            const c_p = this.dataUser.capital_producto + p.cantidad * p.costo;
            const c_c = this.dataUser.capital_caja - p.cantidad * p.costo;
           
            const u_c =
              this.dataUser.utilidades_caja -
              (p.cantidad * p.precio - p.cantidad * p.costo);
            const newStock = docAlmacen.data().stock + p.cantidad;
            transaction.update(confiRef, {
              capital_producto: c_p,
              capital_caja: c_c,
              utilidades_caja: u_c,
            });

            transaction.update(docRef, {
              stock: newStock,
            });

            await deleteDoc(docRefV);
            alert("Eliminado");
            return true;
          });
        
         
        } catch (error) {
          console.error("Error eliminando el documento: ", error);
        }
      }
    },

    //GASTOS
    async addGasto(p) {
      if (p.valor > this.dataUser.utilidades_caja) {
        alert("No tiene los suficientes fondos para agregar este registro");
        return;
      }
      this.formGasto = false;
      const confiRef = doc(db, "userData", this.dataUser.id);
      try {
        await runTransaction(db, async (transaction) => {
          const u_c = this.dataUser.utilidades_caja - p.valor;
          const c_c = this.dataUser.capital_caja - p.valor;
          const docRef = await addDoc(collection(db, "Gastos"), p);
          if(p.salidaD==='Utilidades'){
            await transaction.update(confiRef, {
              utilidades_caja: u_c,
            });
          }else{

            await transaction.update(confiRef, {
              capital_caja: c_c,
            });
          }
        
        });

        alert("Registro guardado");
        return true;
      } catch (e) {
        alert("Ocurrio un error :", e);
        return false;
      }
    },

    async getGastos(fi, ff) {
      const q = query(
        collection(db, "Gastos"),
        where("fecha", ">=", fi),
        where("fecha", "<=", ff)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const alma = [];
        this.cierre.gastos = 0;
        this.cierre.compras = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Si el campo "id" no está definido, lo agregamos usando el ID del documento
          if (!data.id) {
            data.id = doc.id;
          }
          alma.push(data);
          if(data.salidaD==='Utilidades'){
            this.cierre.gastos += data.valor;
          }else{
            this.cierre.compras += data.valor;
          }
         
        });
        
        this.gastos = alma;
      });
    },
    async eliminarGasto(p) {
      if (
        confirm(
          "¿Estás seguro que deseas eliminar este registro?, lo cual su valor sera devuelto a caja"
        )
      ) {
        const docRef = await doc(db, "Gastos", p.id);
        const confiRef = doc(db, "userData", this.dataUser.id);
        try {
          await runTransaction(db, async (transaction) => {
            await deleteDoc(docRef);
            const u_c = this.dataUser.utilidades_caja + p.valor;
            const c_c = this.dataUser.capital_caja + p.valor;
            if(p.salidaD==='Utilidades'){
              transaction.update(confiRef, { utilidades_caja: u_c });
            }else{
              transaction.update(confiRef, { capital_caja: c_c });
            }
          
          });

          alert("Eliminado");
        } catch (error) {
          console.error("Error eliminando el documento: ", error);
        }
      }
    },

    //CIERRE DE CAJA DIARIO
    async cerrar_caja(f) {
      this.cierre.fecha=f
  if(!confirm("Esta seguro en realizar el cierre?"))return;
  
 
    
      try {
         const docRef = await setDoc(doc(db, "Cierres", this.cierre.fecha), this.cierre);
        alert("Cierre guardado con exito");
        this.formCierre=false;
        return true;
      } catch (e) {
        alert("Ocurrio un error :", e);
        this.formCierre=false;
        return false;
       
      }
    },

    //FECHA ACTUAL FUNCION
    hoy() {
      const date = new Date();
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    },
  },

  getters: {
    ////////
  },
});
