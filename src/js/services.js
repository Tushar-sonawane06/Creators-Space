document.addEventListener("DOMContentLoaded", () => {
  const authSection = document.getElementById("authSection");
  const userSection = document.getElementById("userSection");
  const logoutBtn = document.getElementById("logoutBtn");

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  console.log("Login state:", isLoggedIn);

  if (isLoggedIn === "true") {
    authSection.style.display = "none";
    userSection.style.display = "flex";
  } else {
    authSection.style.display = "flex";
    userSection.style.display = "none";
  }

    logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    if (location.pathname.split('/').pop() === 'index.html' || location.pathname.endsWith('/')) location.href = 'index.html'; else location.href = '../index.html';
  });
});
