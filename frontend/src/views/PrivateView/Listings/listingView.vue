<template>
  <div class="contador-container">
    <h1>Teste pra página de usuário comum</h1>
    <p>Você só pode conseguir ver essa página pelo perfil de usuário comum.</p>
    
    <div class="card">
      <p>Cliques: <strong>{{ cliques }}</strong></p>
      <button @click="incrementar">Contar Clique</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Define uma variável reativa tipada como número
const cliques = ref<number>(0)

// Função para incrementar o contador (o retorno é void)
const incrementar = (): void => {
  cliques.value++
}
</script>

<style scoped>
.contador-container {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 40px;
}

.card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  display: inline-block;
  background-color: #f9f9f9;
}

button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #35495e;
}
</style>
