console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const gridViewBtn = document.getElementById("gridViewBtn");
  const tableViewBtn = document.getElementById("tableViewBtn");
  const coursesContainer = document.querySelector(".courses-container");
  const coursesTable = document.getElementById("coursesTable");
  const compareBtn = document.getElementById("compareBtn");
  const comparePanel = document.getElementById("comparePanel");
  const compareTableBody = document.getElementById("compareTableBody");
  const courseSearchInput = document.getElementById("courseSearch");
  const closeCompare = document.getElementById("closeCompare");
  const compareMsg = document.getElementById("compareMsg");
  const chatbotToggle = document.querySelector(".chatbot-toggle");
  const chatWindow = document.querySelector(".chatbot-window");
  const userInput = document.getElementById("user-input");
  const chatBody = document.getElementById("chat-body");

  // ✅ Grid/Table Toggle
  if (gridViewBtn && tableViewBtn && coursesContainer && coursesTable) {
    gridViewBtn.addEventListener("click", () => {
      gridViewBtn.classList.add("active");
      tableViewBtn.classList.remove("active");
      coursesContainer.style.display = "grid";
      coursesTable.classList.add("hidden");
    });

    tableViewBtn.addEventListener("click", () => {
      tableViewBtn.classList.add("active");
      gridViewBtn.classList.remove("active");
      coursesContainer.style.display = "none";
      coursesTable.classList.remove("hidden");
    });
  }

  // ✅ Search Filter
  function filterCourses() {
    if (!courseSearchInput) return;
    const input = courseSearchInput.value.toLowerCase();

    // Grid view filter
    if (coursesContainer) {
      const cards = coursesContainer.querySelectorAll(".card");
      cards.forEach((card) => {
        const title = card.querySelector("h3")?.innerText.toLowerCase() || "";
        const desc = Array.from(card.querySelectorAll("p"))
          .map((p) => p.innerText.toLowerCase())
          .join(" ");
        card.style.display =
          title.includes(input) || desc.includes(input) ? "block" : "none";
      });
    }

    // Table view filter
    if (coursesTable) {
      const rows = coursesTable.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const courseName = row.cells[1]?.innerText.toLowerCase() || "";
        row.style.display = courseName.includes(input) ? "" : "none";
      });
    }
  }
  if (courseSearchInput) {
    courseSearchInput.addEventListener("keyup", filterCourses);
  }

  // ✅ Syllabus Toggle
  function toggleSyllabus(card) {
    if (!card) return;
    const syllabus = card.querySelector(".syllabus");
    const enroll = card.querySelector(".enroll");
    if (syllabus && enroll) {
      syllabus.classList.toggle("hidden");
      enroll.classList.toggle("hidden");
    }
  }
  document.querySelectorAll(".info-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSyllabus(btn.closest(".card"));
    });
  });

  // ✅ Checkbox Syncing (Grid View only)
  function syncCheckboxes() {
    if (!coursesContainer) return;
    const checkboxes = coursesContainer.querySelectorAll(".compare-checkbox");
    const checkedValues = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    checkboxes.forEach((checkbox) => {
      checkbox.checked = checkedValues.includes(checkbox.value);
    });
  }
  if (coursesContainer) {
    coursesContainer
      .querySelectorAll(".compare-checkbox")
      .forEach((checkbox) => {
        checkbox.addEventListener("change", syncCheckboxes);
      });
  }

  // ✅ Comparison Logic (Grid View only)
  if (compareBtn && comparePanel && compareTableBody) {
    compareBtn.addEventListener("click", () => {
      if (!coursesContainer) return;

      const selected = coursesContainer.querySelectorAll(
        ".compare-checkbox:checked"
      );
      compareTableBody.innerHTML = "";

      if (selected.length < 2) {
        if (compareMsg) compareMsg.style.display = "block";
        comparePanel.classList.add("hidden");
        return;
      } else {
        if (compareMsg) compareMsg.style.display = "none";
      }

      selected.forEach((checkbox) => {
        const courseName = checkbox.value;
        const card = checkbox.closest(".card");
        const price = card?.querySelector(".price")?.innerText || "N/A";
        const duration = card?.querySelector(".duration")?.innerText || "N/A";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${courseName}</td>
          <td>${price}</td>
          <td>${duration}</td>
          <td><button class="remove-btn" data-course="${courseName}">Remove</button></td>
        `;
        compareTableBody.appendChild(tr);
      });

      comparePanel.classList.remove("hidden");

      // Remove Button Listeners
      compareTableBody.querySelectorAll(".remove-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const courseName = btn.getAttribute("data-course");
          coursesContainer
            .querySelectorAll(`.compare-checkbox[value="${courseName}"]`)
            .forEach((cb) => {
              cb.checked = false;
            });
          syncCheckboxes();
          btn.closest("tr")?.remove();
          if (compareTableBody.children.length < 2) {
            comparePanel.classList.add("hidden");
            if (compareMsg) compareMsg.style.display = "block";
          }
        });
      });
    });
  }

  // ✅ Close Compare Panel
  if (closeCompare && comparePanel) {
    closeCompare.addEventListener("click", () => {
      comparePanel.classList.add("hidden");
      if (compareMsg) compareMsg.style.display = "none";
    });
  }

  // ✅ Chatbot Toggle
  if (chatbotToggle && chatWindow) {
    chatbotToggle.addEventListener("click", () => {
      chatWindow.style.display =
        chatWindow.style.display === "none" ? "flex" : "none";
    });
  }

  // ✅ Chatbot Functionality
  function handleUserInput() {
    if (!userInput) return;
    const input = userInput.value.trim().toLowerCase();
    if (!input) return;

    appendMessage("user", input);

    let response = "";
    if (/graphic design/.test(input)) {
      response =
        "🎨 Graphic Design:\nPrice: ₹4,499\nDuration: 3 Months\nIncludes hands-on projects and portfolio building.";
    } else if (/ui\/?ux design/.test(input)) {
      response =
        "🧩 UI/UX Design:\nPrice: ₹5,999\nDuration: 4 Months\nIncludes wireframing, prototyping, and user research.";
    } else if (/web development/.test(input)) {
      response =
        "💻 Web Development:\nPrice: ₹12,999\nDuration: 6 Months\nCovers HTML, CSS, JS, React, Node.js.";
    } else if (/c programming/.test(input)) {
      response =
        "🔧 C Programming:\nPrice: ₹2,999\nDuration: 3 Months\nIncludes syntax, memory management, and data structures.";
    } else if (/python programming/.test(input)) {
      response =
        "🐍 Python Programming:\nPrice: ₹2,999\nDuration: 3 Months\nCovers syntax, OOP, and real-world projects.";
    } else if (/data analytics/.test(input)) {
      response =
        "📊 Data Analytics:\nPrice: ₹7,999\nDuration: 4 Months\nCovers Excel, Power BI, and Tableau.";
    } else if (/enroll/.test(input)) {
      response =
        "🚀 You can enroll now by clicking [Enroll Now](#). Let’s get started!";
    } else if (/contact/.test(input)) {
      response =
        "📞 You can contact us at +91xxxxxxxx89 or email us at 21brac0401@polygwalior.ac.in for more information.";
    } else if (/hi|hello|hey/.test(input)) {
      response = "👋 Hello, how may I help you?";
    } else if (/bye|exit|quit/.test(input)) {
      response = "👋 Goodbye, thanks for chatting with us!";
    } else if (/thank you|thanks/.test(input)) {
      response = "😊 You're welcome!";
    } else if (/help/.test(input)) {
      response =
        "🆘 How can I assist you? You can ask about our courses, pricing, or enrollment process.";
    } else if (/courses|programs/.test(input)) {
      response =
        "📚 We offer courses in Graphic Design, UI/UX Design, Web Development, C Programming, Python Programming, and Data Analytics. You can ask for details on any of these.";
    } else {
      response =
        "🤔 I'm not sure about that. You can ask about Graphic Design, UI/UX, Web Development, C Programming, Python Programming, or Data Analytics.";
    }

    appendMessage("bot", response);
    userInput.value = "";
  }

  function appendMessage(sender, text) {
    if (!chatBody) return;
    const message = document.createElement("div");
    message.className = sender === "bot" ? "bot-message" : "user-message";
    message.textContent = text;
    chatBody.appendChild(message);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // ✅ Attach chatbot input handler
  if (userInput) {
    userInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        handleUserInput();
      }
    });
  }
});
