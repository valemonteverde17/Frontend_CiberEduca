# 🧪 Guía de Pruebas - Sistema de Políticas

## Pruebas Rápidas para Verificar la Implementación

### 1. Verificar Páginas Legales

Accede directamente a estas URLs (sin necesidad de estar logueado):

```
http://localhost:5173/privacy
http://localhost:5173/terms
http://localhost:5173/cookies
```

**Verificar:**
- ✅ Las páginas cargan correctamente
- ✅ El botón "Volver" funciona
- ✅ El contenido es legible y está bien formateado
- ✅ El diseño es responsive (prueba en diferentes tamaños de ventana)

---

### 2. Verificar Formulario de Registro

Accede a:
```
http://localhost:5173/signup
```

**Verificar:**

#### A. Checkbox de Términos
- ✅ Aparece el checkbox con los enlaces a las políticas
- ✅ Los enlaces abren las políticas en nueva pestaña
- ✅ El mensaje "Debes aceptar los términos..." aparece cuando no está marcado

#### B. Validación del Formulario
1. **Sin marcar el checkbox:**
   - El botón "Crear Cuenta" debe estar deshabilitado (gris)
   - Si intentas enviar, debe mostrar error

2. **Con checkbox marcado:**
   - El botón "Crear Cuenta" se habilita (naranja)
   - Puedes proceder con el registro

#### C. Flujo Completo de Registro
1. Completa el formulario:
   - Usuario: `testuser123`
   - Rol: Estudiante
   - Contraseña: `Test1234!`
   - Confirmar contraseña: `Test1234!`
   
2. **NO marques el checkbox** → Intenta enviar
   - ❌ Debe mostrar: "Debes aceptar los términos y condiciones para continuar"

3. **Marca el checkbox** → Envía el formulario
   - ✅ Debe proceder normalmente con el registro

---

### 3. Verificar Enlaces en el Checkbox

Desde el formulario de registro:

1. **Click en "Términos y Condiciones"**
   - ✅ Abre `/terms` en nueva pestaña
   - ✅ Puedes leer el contenido
   - ✅ El botón "Volver" regresa a la página anterior

2. **Click en "Política de Privacidad"**
   - ✅ Abre `/privacy` en nueva pestaña
   - ✅ Contenido completo visible

3. **Click en "Política de Cookies"**
   - ✅ Abre `/cookies` en nueva pestaña
   - ✅ Información sobre localStorage visible

---

### 4. Pruebas de Responsive

#### Desktop (1920x1080)
- ✅ Páginas legales: contenido centrado, máximo 900px de ancho
- ✅ Formulario: checkbox y textos bien alineados

#### Tablet (768px)
- ✅ Páginas legales: padding reducido, texto legible
- ✅ Formulario: checkbox responsive

#### Mobile (375px)
- ✅ Páginas legales: padding mínimo, texto adaptado
- ✅ Formulario: checkbox más pequeño pero funcional

---

### 5. Pruebas de Navegación

#### Desde cualquier página legal:
1. Click en "Volver"
   - ✅ Regresa a la página anterior (history.back())

2. Navegación del navegador
   - ✅ Botón atrás del navegador funciona
   - ✅ Botón adelante del navegador funciona

---

### 6. Pruebas de Validación

Intenta registrarte con diferentes combinaciones:

| Usuario | Contraseña | Confirmar | Términos | Resultado Esperado |
|---------|-----------|-----------|----------|-------------------|
| test | Test1234! | Test1234! | ❌ | ❌ Error: "Debes aceptar..." |
| testuser | Test1234! | Test1234! | ✅ | ❌ Error: "Usuario muy corto" |
| testuser123 | test | test | ✅ | ❌ Error: "Contraseña no cumple requisitos" |
| testuser123 | Test1234! | Test5678! | ✅ | ❌ Error: "Contraseñas no coinciden" |
| testuser123 | Test1234! | Test1234! | ✅ | ✅ Registro exitoso |

---

### 7. Verificar Estilos

#### Checkbox de Términos:
- ✅ Fondo gris claro (#f8f9fa)
- ✅ Borde redondeado
- ✅ Checkbox personalizado (no el nativo del navegador)
- ✅ Hover en checkbox: borde azul
- ✅ Checked: fondo azul con checkmark blanco

#### Enlaces:
- ✅ Color azul (#667eea)
- ✅ Hover: subrayado y color más oscuro
- ✅ Font-weight: 600 (semi-bold)

#### Páginas Legales:
- ✅ Fondo degradado púrpura
- ✅ Contenedor blanco centrado
- ✅ Títulos en azul (#667eea)
- ✅ Secciones bien espaciadas

---

### 8. Pruebas de Accesibilidad

1. **Navegación por teclado:**
   - Tab para navegar entre campos
   - Espacio para marcar/desmarcar checkbox
   - Enter para enviar formulario

2. **Lectores de pantalla:**
   - Labels asociados correctamente
   - Mensajes de error descriptivos

---

### 9. Consola del Navegador

Abre DevTools (F12) y verifica:

- ✅ No hay errores en consola
- ✅ No hay warnings de React
- ✅ Las rutas se cargan correctamente
- ✅ Los componentes se renderizan sin problemas

---

### 10. Prueba de Integración Completa

**Escenario:** Usuario nuevo se registra

1. Visita `/signup`
2. Lee los términos (click en cada enlace)
3. Vuelve al formulario
4. Completa todos los campos
5. Marca el checkbox de aceptación
6. Envía el formulario
7. Espera mensaje de éxito
8. Redirección a `/login`

**Resultado esperado:**
- ✅ Todo funciona sin errores
- ✅ Usuario puede leer las políticas antes de aceptar
- ✅ Validación funciona correctamente
- ✅ Registro se completa exitosamente

---

## 🐛 Problemas Comunes

### El checkbox no aparece
- Verifica que `TermsAcceptance.jsx` esté importado en `SignUp.jsx`
- Revisa la consola por errores de importación

### Las páginas legales no cargan
- Verifica que las rutas estén en `App.jsx`
- Confirma que los imports de las páginas sean correctos

### Los enlaces no funcionan
- Verifica que uses `<Link>` de react-router-dom
- Confirma que `target="_blank"` esté presente

### El botón no se habilita
- Verifica que `termsAccepted` esté en el estado
- Confirma que la condición del `disabled` incluya `!termsAccepted`

---

## ✅ Checklist Final

- [ ] Todas las páginas legales cargan
- [ ] Checkbox aparece en el formulario
- [ ] Enlaces abren en nueva pestaña
- [ ] Validación de términos funciona
- [ ] Botón se habilita/deshabilita correctamente
- [ ] Mensajes de error aparecen
- [ ] Diseño responsive funciona
- [ ] No hay errores en consola
- [ ] Navegación funciona correctamente
- [ ] Registro completo funciona

---

## 🎉 Si todo funciona...

¡Felicidades! El sistema de políticas está completamente implementado y funcionando. Los usuarios ahora deben aceptar explícitamente los términos antes de registrarse.
