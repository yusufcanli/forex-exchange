<template>
    <div class="dropdown-wrapper">
        <button @blur="show = false" v-on:click="show = !show">
            <div>{{ active.name }}</div>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" fill="#6b7280" viewBox="0 0 512 512">
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                </svg>
            </div>
        </button>
        <transition name="animate">
            <div class="dropdown-menu" v-if="show">
                <ul>
                    <li v-for="(value, name, index) in items" :key="index">
                        <div @click="emit('setCurrency', { name: value, code: name })" class="dropdown-item">{{ value }}</div>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue'

interface IProps {
    items: Object,
    active: {
        name: String,
        code: String
    }
}

const props = defineProps<IProps>()
const emit = defineEmits(['change', 'setCurrency'])

const show = ref(false)

</script>
  
<style scoped>
button {
    cursor: pointer;
    background-color: #ffffff;
    padding: 0.7rem 1rem;
    transition: all .4s;
    white-space: nowrap;
    border-radius: 8px;
    width: 100%;
    border: 2px solid #cfd3d9;
    color: #6b7280;
    display: flex;
    justify-content: space-between;
    font-weight: 600;
}

button:focus {
    outline: none;
}

ul {
    list-style: none;
    overflow: hidden;
    border-radius: 8px;
}


.animate-enter-active,
.animate-leave-active {
    transition: all .4s;
    transform: translateY(0px);
}

.animate-enter-from,
.animate-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

.dropdown-wrapper {
    position: relative;
    width: 100%;
    margin: 0.5rem;
}

.dropdown-menu {
    position: absolute;
    margin-top: 0.25rem;
    border-radius: 8px;
    z-index: 1;
    width: 100%;
    background-color: #ffffff;
    border: 2px solid #cfd3d9;
    box-sizing: border-box;
    max-height: 200px;
    overflow: auto;
}

.dropdown-item {
    display: block;
    padding: 0.3rem 1rem;
    cursor: pointer;
    color: #6b7280;
}

.dropdown-item:hover {
    background-color: #f5f6f8;
}
</style>