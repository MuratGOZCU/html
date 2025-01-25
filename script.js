document.addEventListener("DOMContentLoaded", () => {
  const imageUpload = document.getElementById("imageUpload");
  const processButton = document.getElementById("processButton");
  const originalImage = document.getElementById("originalImage");
  const processedImage = document.getElementById("processedImage");
  const loadingEffect = document.querySelector(".loading-effect");
  const uploadPlaceholder = document.querySelector(".upload-placeholder");
  const previewContainer = document.querySelector(".preview-container");
  const patternContainer = document.querySelector(".pattern-container");
  const categorySelect = document.getElementById("categorySelect");
  const downloadButton = document.getElementById("downloadButton");
  let selectedPattern = null;

  imageUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        originalImage.src = e.target.result;
        originalImage.style.display = "block";
        uploadPlaceholder.style.display = "block";
        processButton.disabled = false;
        processedImage.classList.add("hidden");
        previewContainer.style.border = "2px dashed #dfe6e9";
      };
      reader.readAsDataURL(file);
    }
  });

  processButton.addEventListener("click", async () => {
    const base64Image = originalImage.src.split(",")[1];
    loadingEffect.classList.remove("hidden");
    processButton.disabled = true;

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "25c9feeb08mshb56314eabf7b4eap1de14ajsnd5b4de99c9e0", // PUT IT RemoveAPI KEY BUT USE YOUR OWN KEY AND BACKEND APİ (PHP,.NET, NODEJS, PYTHON, JAVA, C# ...)
        "X-RapidAPI-Host": "remove-background-new-version.p.rapidapi.com",
      },
      body: JSON.stringify({
        base64_image: base64Image,
        isShadow: true,
      }),
    };

    try {
      const response = await fetch(
        "https://remove-background-new-version.p.rapidapi.com/remove-background",
        options
      );
      const result = await response.json();

      if (result.success) {
        processedImage.src = result.image_url;
        processedImage.onload = () => {
          loadingEffect.classList.add("hidden");
          processedImage.classList.remove("hidden");
          originalImage.style.display = "none";
          previewContainer.style.border = "none";

          // Set initial styles
          processedImage.style.width = "300px";
          processedImage.style.height = "auto";
          processedImage.style.transform = "translate(0, 0)";
          processedImage.setAttribute("data-x", 0);
          processedImage.setAttribute("data-y", 0);

          makeImageInteractive();
        };
      }
    } catch (error) {
      console.error("Error:", error);
      loadingEffect.classList.add("hidden");
    } finally {
      processButton.disabled = false;
    }
  });

  // Drag and drop functionality
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    previewContainer.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    previewContainer.addEventListener(
      eventName,
      () => {
        previewContainer.classList.add("highlight");
      },
      false
    );
  });

  ["dragleave", "drop"].forEach((eventName) => {
    previewContainer.addEventListener(
      eventName,
      () => {
        previewContainer.classList.remove("highlight");
      },
      false
    );
  });

  previewContainer.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    const file = dt.files[0];

    if (file && file.type.startsWith("image/")) {
      imageUpload.files = dt.files;
      const event = new Event("change");
      imageUpload.dispatchEvent(event);
    }
  });

  // Debug: Check if elements exist
  console.log("Pattern Container:", patternContainer);
  console.log("Category Select:", categorySelect);

  const backgroundPatterns = {
    kitchen: [
      {
        url: "https://media.istockphoto.com/id/1209045780/photo/empty-podium-or-pedestal-display-on-white-background-with-cylinder-stand-concept-blank.jpg?s=612x612&w=0&k=20&c=IhMHy1jCjw9V38A78IKNONebLosTiJyTZS3632wEYpU=",
        name: "Kitchen Table",
      },
      {
        url: "./images/k1.jpg",
        name: "Kitchen Counter",
      },
      {
        url: "./images/k2.jpg",
        name: "Kitchen Counter",
      },
      {
        url: "./images/k3.jpg",
        name: "Kitchen Counter",
      },
      {
        url: "./images/k4.jpg",
        name: "Kitchen Counter",
      },
      {
        url: "./images/k5.jpg",
        name: "Kitchen Counter",
      },
      {
        url: "./images/k6.jpg",
        name: "Kitchen Counter",
      },
      {
        url: "./images/k7.jpg",
        name: "Kitchen Counter",
      },
    ],
    office: [
      {
        url: "https://plus.unsplash.com/premium_photo-1701842912302-501bfc88c403?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29sb3IlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww",
        name: "Office Desk",
      },
      {
        url: "https://i0.wp.com/picjumbo.com/wp-content/uploads/red-and-blue-pillars-wallpaper-abstract-background-free-image.jpeg?w=600&quality=80",
        name: "Meeting Room",
      },
    ],
    nature: [
      {
        url: "https://t4.ftcdn.net/jpg/02/40/63/55/360_F_240635575_EJifwRAbKsVTDnA3QE0bCsWG5TLhUNEZ.jpg",
        name: "Forest",
      },
      {
        url: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3JtNDIyLTA3Ni14LmpwZw.jpg",
        name: "Beach",
      },
    ],
  };

  function updatePatterns(category) {
    const patternContainer = document.querySelector(".pattern-container");
    if (!patternContainer) {
      console.error("Pattern container not found!");
      return;
    }

    console.log("Updating patterns for category:", category);
    patternContainer.innerHTML = ""; // Clear existing patterns

    let patternsToShow = [];
    if (category === "all") {
      Object.values(backgroundPatterns).forEach((patterns) => {
        patternsToShow = patternsToShow.concat(patterns);
      });
    } else {
      patternsToShow = backgroundPatterns[category] || [];
    }

    console.log("Patterns to show:", patternsToShow.length);

    patternsToShow.forEach((pattern, index) => {
      const patternItem = document.createElement("div");
      patternItem.className = "pattern-item";
      // Make the first pattern selected by default
      if (index === 0) {
        patternItem.classList.add("selected");
        selectedPattern = pattern.url;
        // Set the background of preview container
        previewContainer.style.backgroundImage = `url(${selectedPattern})`;
        previewContainer.style.backgroundSize = "cover";
        previewContainer.style.backgroundPosition = "center";
      }
      patternItem.setAttribute("title", pattern.name);

      const img = document.createElement("img");
      img.src = pattern.url;
      img.alt = pattern.name;

      patternItem.appendChild(img);
      patternContainer.appendChild(patternItem);

      console.log("Created pattern item:", pattern.name);
    });
  }

  // Category selection handling
  if (categorySelect) {
    categorySelect.addEventListener("change", (e) => {
      const selectedCategory = e.target.value;
      console.log("Category changed to:", selectedCategory);
      updatePatterns(selectedCategory);
    });

    // Initialize with all patterns
    console.log("Initializing patterns...");
    updatePatterns("all");
  } else {
    console.error("Category select not found!");
  }

  // Pattern selection handling
  document.addEventListener("click", (e) => {
    const patternItem = e.target.closest(".pattern-item");
    if (!patternItem) return;

    console.log("Pattern clicked");
    document.querySelectorAll(".pattern-item").forEach((item) => {
      item.classList.remove("selected");
    });

    patternItem.classList.add("selected");
    selectedPattern = patternItem.querySelector("img").src;
    previewContainer.style.backgroundImage = `url(${selectedPattern})`;
    previewContainer.style.backgroundSize = "cover";
    previewContainer.style.backgroundPosition = "center";
  });

  // Update the processButton click handler to maintain the background
  const originalProcessButtonHandler = processButton.onclick;
  processButton.onclick = async () => {
    await originalProcessButtonHandler();

    if (selectedPattern) {
      const processedImageContainer = document.querySelector(
        ".preview-box.processed .image-container"
      );
      processedImageContainer.style.backgroundImage = `url(${selectedPattern})`;
      processedImageContainer.style.backgroundSize = "cover";
      processedImageContainer.style.backgroundPosition = "center";
    }
  };

  // Add a reset function for when a new image is selected
  function resetLayout() {
    document.querySelector(".preview-box.original").style.display = "block";
    document.querySelector(".arrow-separator").style.display = "flex";
    document.querySelector(".preview-box.processed").style.flex = "1";
    processedImage.classList.add("hidden");
  }

  // Call resetLayout when a new image is selected
  imageUpload.addEventListener("change", resetLayout);

  function makeImageInteractive() {
    interact("#processedImage")
      .draggable({
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: "parent",
            endOnly: true,
          }),
        ],
        autoScroll: true,
        listeners: {
          move: dragMoveListener,
        },
      })
      .resizable({
        edges: { right: true, bottom: true, left: true, top: true },
        restrictEdges: {
          outer: "parent",
          endOnly: true,
        },
        restrictSize: {
          min: { width: 100, height: 100 },
          max: { width: 1200, height: 1200 },
        },
        inertia: true,
        preserveAspectRatio: true,
      })
      .on("resizemove", resizeMoveListener);

    function dragMoveListener(event) {
      const target = event.target;
      const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
      const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px)`;
      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    }

    function resizeMoveListener(event) {
      const target = event.target;
      let x = parseFloat(target.getAttribute("data-x")) || 0;
      let y = parseFloat(target.getAttribute("data-y")) || 0;

      target.style.width = event.rect.width + "px";
      target.style.height = event.rect.height + "px";

      x += event.deltaRect.left;
      y += event.deltaRect.top;

      target.style.transform = `translate(${x}px, ${y}px)`;
      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    }
  }

  // Update processedImage onload handler
  processedImage.onload = () => {
    loadingEffect.classList.add("hidden");
    processedImage.classList.remove("hidden");
    originalImage.style.display = "none";

    // Set initial styles with larger default size
    processedImage.style.width = "400px"; // Increased from 300px
    processedImage.style.height = "auto";
    processedImage.style.transform = "translate(0, 0)";
    processedImage.setAttribute("data-x", 0);
    processedImage.setAttribute("data-y", 0);

    makeImageInteractive();
    downloadButton.disabled = false;
  };

  // Add this function to capture and download the combined image
  function downloadCombinedImage() {
    const previewContainer = document.querySelector(".preview-container");

    // html2canvas seçenekleri
    const options = {
      scale: 2, // 2x kalite için
      useCORS: true, // cross-origin görseller için
      allowTaint: true,
      backgroundColor:
        window.getComputedStyle(previewContainer).backgroundColor,
      logging: false,
      imageTimeout: 0,
      onclone: (clonedDoc) => {
        // Klonlanmış elementlerde görünürlük kontrolü
        const clonedContainer = clonedDoc.querySelector(".preview-container");
        if (clonedContainer) {
          clonedContainer.style.transform = "none";
          clonedContainer.style.position = "relative";
        }
      },
    };

    html2canvas(previewContainer, options)
      .then((canvas) => {
        // Canvas'ı PNG olarak indir
        const link = document.createElement("a");
        link.download = "screenshot.png";
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
      })
      .catch((error) => {
        console.error("Screenshot alınırken hata oluştu:", error);
        alert("Görüntü oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
      });
  }

  // Add download button click handler
  downloadButton.addEventListener("click", downloadCombinedImage);

  function initTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        // Add active class to clicked button and corresponding content
        button.classList.add("active");
        const tabId = button.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
      });
    });
  }

  initTabs();

  const uploadArea = document.getElementById("uploadArea");
  const fullscreenBtn = document.getElementById("fullscreenBtn");

  fullscreenBtn.addEventListener("click", toggleFullscreen);

  // Handle ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && uploadArea.classList.contains("fullscreen")) {
      exitFullscreen();
    }
  });

  function toggleFullscreen() {
    if (!uploadArea.classList.contains("fullscreen")) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }

  function enterFullscreen() {
    uploadArea.classList.add("fullscreen");
    document.body.style.overflow = "hidden";

    if (uploadArea.requestFullscreen) {
      uploadArea.requestFullscreen();
    } else if (uploadArea.webkitRequestFullscreen) {
      uploadArea.webkitRequestFullscreen();
    } else if (uploadArea.msRequestFullscreen) {
      uploadArea.msRequestFullscreen();
    }
  }

  function exitFullscreen() {
    uploadArea.classList.remove("fullscreen");
    document.body.style.overflow = "";

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  // Handle fullscreen change events
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("mozfullscreenchange", handleFullscreenChange);
  document.addEventListener("MSFullscreenChange", handleFullscreenChange);

  function handleFullscreenChange() {
    if (
      !document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.mozFullScreenElement &&
      !document.msFullscreenElement
    ) {
      exitFullscreen();
    }
  }
});
