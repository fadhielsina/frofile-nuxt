<template>
  <div class="flex min-h-screen">
    <AdminSidebar />
    <main class="flex-1 overflow-x-hidden">
      <div class="mx-auto max-w-4xl p-6 sm:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>
