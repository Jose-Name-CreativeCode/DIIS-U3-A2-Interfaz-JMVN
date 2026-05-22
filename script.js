// Datos base de empleados
const employees = [
  {
    id: 1,
    name: "Juan Pérez",
    position: "Operador de producción",
    salary: 13000,
    status: "Activo",
    area: "produccion",
    contract: "tiempo-completo",
  },
  {
    id: 2,
    name: "María López",
    position: "Auxiliar administrativo",
    salary: 14500,
    status: "Activo",
    area: "administracion",
    contract: "tiempo-completo",
  },
  {
    id: 3,
    name: "Carlos Hernández",
    position: "Ejecutivo de ventas",
    salary: 10000000,
    status: "Inactivo",
    area: "ventas",
    contract: "medio-tiempo",
  },
  {
    id: 4,
    name: "Ana Torres",
    position: "Auxiliar de almacén",
    salary: 9500,
    status: "Activo",
    area: "almacen",
    contract: "temporal",
  },
];

// Elementos principales
const employeeTable = document.getElementById("employeeTable");
const searchInput = document.getElementById("searchInput");
const areaFilter = document.getElementById("areaFilter");
const contractFilter = document.getElementById("contractFilter");
const roleSelect = document.getElementById("roleSelect");

const addBtn = document.getElementById("addBtn");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const calculateBtn = document.getElementById("calculateBtn");
const payrollForm = document.getElementById("payrollForm");

const employeeName = document.getElementById("employeeName");
const employeePosition = document.getElementById("employeePosition");
const employeeStatus = document.getElementById("employeeStatus");
const baseSalary = document.getElementById("baseSalary");
const bonus = document.getElementById("bonus");
const extraHours = document.getElementById("extraHours");
const taxes = document.getElementById("taxes");
const insurance = document.getElementById("insurance");
const otherDiscounts = document.getElementById("otherDiscounts");

const grossSalary = document.getElementById("grossSalary");
const totalDeductions = document.getElementById("totalDeductions");
const netSalary = document.getElementById("netSalary");

// Formato de moneda
function formatCurrency(value) {
  return value.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });
}

// Mostrar empleados en tabla
function renderEmployees(list = employees) {
  employeeTable.innerHTML = "";

  if (list.length === 0) {
    employeeTable.innerHTML = `
      <tr>
        <td colspan="5">No se encontraron empleados.</td>
      </tr>
    `;
    return;
  }

  list.forEach((employee) => {
    const row = document.createElement("tr");

    row.setAttribute("data-area", employee.area);
    row.setAttribute("data-contract", employee.contract);

    row.innerHTML = `
      <td>
        <input type="radio" name="employee" value="${employee.id}">
      </td>
      <td>${employee.name}</td>
      <td>${employee.position}</td>
      <td>${formatCurrency(employee.salary)}</td>
      <td>
        <span class="status ${employee.status === "Activo" ? "active" : "inactive"}">
          ${employee.status}
        </span>
      </td>
    `;

    employeeTable.appendChild(row);
  });
}

// Buscar y filtrar empleados
function filterEmployees() {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedArea = areaFilter.value;
  const selectedContract = contractFilter.value;

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchText) ||
      employee.position.toLowerCase().includes(searchText);

    const matchesArea =
      selectedArea === "todos" || employee.area === selectedArea;

    const matchesContract =
      selectedContract === "todos" || employee.contract === selectedContract;

    return matchesSearch && matchesArea && matchesContract;
  });

  renderEmployees(filteredEmployees);
}

// Obtener empleado seleccionado
function getSelectedEmployee() {
  const selectedRadio = document.querySelector(
    'input[name="employee"]:checked',
  );

  if (!selectedRadio) {
    alert("Selecciona un empleado primero.");
    return null;
  }

  const employeeId = Number(selectedRadio.value);
  return employees.find((employee) => employee.id === employeeId);
}

// Cargar información del empleado en el formulario
function loadEmployeeToForm(employee) {
  employeeName.value = employee.name;
  employeePosition.value = employee.position;
  employeeStatus.value = employee.status.toLowerCase();
  baseSalary.value = employee.salary;

  bonus.value = "";
  extraHours.value = "";
  taxes.value = "";
  insurance.value = "";
  otherDiscounts.value = "";

  resetTotals();
}

// Botón editar
function editEmployee() {
  const selectedEmployee = getSelectedEmployee();

  if (!selectedEmployee) return;

  loadEmployeeToForm(selectedEmployee);
}

// Botón agregar
function addEmployee() {
  payrollForm.reset();
  resetTotals();
  alert("Formulario listo para agregar un nuevo empleado.");
}

// Botón eliminar
function deleteEmployee() {
  const selectedEmployee = getSelectedEmployee();

  if (!selectedEmployee) return;

  const confirmDelete = confirm(`¿Deseas eliminar a ${selectedEmployee.name}?`);

  if (!confirmDelete) return;

  const employeeIndex = employees.findIndex(
    (employee) => employee.id === selectedEmployee.id,
  );

  if (employeeIndex !== -1) {
    employees.splice(employeeIndex, 1);
    renderEmployees();
    payrollForm.reset();
    resetTotals();
    alert("Empleado eliminado correctamente.");
  }
}

// Calcular nómina
function calculatePayroll() {
  const salaryValue = Number(baseSalary.value) || 0;
  const bonusValue = Number(bonus.value) || 0;
  const extraHoursValue = Number(extraHours.value) || 0;

  const taxesValue = Number(taxes.value) || 0;
  const insuranceValue = Number(insurance.value) || 0;
  const otherDiscountsValue = Number(otherDiscounts.value) || 0;

  if (salaryValue <= 0) {
    alert("Ingresa un salario base válido.");
    return;
  }

  const gross = salaryValue + bonusValue + extraHoursValue;
  const deductions = taxesValue + insuranceValue + otherDiscountsValue;
  const net = gross - deductions;

  grossSalary.textContent = formatCurrency(gross);
  totalDeductions.textContent = formatCurrency(deductions);
  netSalary.textContent = formatCurrency(net);
}

// Reiniciar totales
function resetTotals() {
  grossSalary.textContent = "$0.00";
  totalDeductions.textContent = "$0.00";
  netSalary.textContent = "$0.00";
}

// Control de accesos por rol
function applyRolePermissions() {
  const selectedRole = roleSelect.value;

  const adminActions = document.querySelectorAll(".action-admin");
  const adminRhActions = document.querySelectorAll(".action-admin-rh");
  const adminContadorActions = document.querySelectorAll(
    ".action-admin-contador",
  );

  adminActions.forEach((element) => element.classList.add("hidden"));
  adminRhActions.forEach((element) => element.classList.add("hidden"));
  adminContadorActions.forEach((element) => element.classList.add("hidden"));

  if (selectedRole === "admin") {
    adminActions.forEach((element) => element.classList.remove("hidden"));
    adminRhActions.forEach((element) => element.classList.remove("hidden"));
    adminContadorActions.forEach((element) =>
      element.classList.remove("hidden"),
    );
  }

  if (selectedRole === "rh") {
    adminRhActions.forEach((element) => element.classList.remove("hidden"));
  }

  if (selectedRole === "contador") {
    adminContadorActions.forEach((element) =>
      element.classList.remove("hidden"),
    );
  }
}

// Mensaje según rol
function showRoleMessage() {
  const selectedRole = roleSelect.options[roleSelect.selectedIndex].text;
  console.log(`Vista actual: ${selectedRole}`);
}

// Eventos
searchInput.addEventListener("input", filterEmployees);
areaFilter.addEventListener("change", filterEmployees);
contractFilter.addEventListener("change", filterEmployees);

addBtn.addEventListener("click", addEmployee);
editBtn.addEventListener("click", editEmployee);
deleteBtn.addEventListener("click", deleteEmployee);

calculateBtn.addEventListener("click", calculatePayroll);

payrollForm.addEventListener("reset", () => {
  setTimeout(resetTotals, 0);
});

roleSelect.addEventListener("change", () => {
  applyRolePermissions();
  showRoleMessage();
});

// Inicio del sistema
renderEmployees();
applyRolePermissions();
