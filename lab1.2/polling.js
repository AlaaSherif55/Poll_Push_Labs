const content = document.getElementById("content");

function doPolling(lastModified) {
  $.ajax({
    method: "POST",
    url: "http://127.0.0.1:8000/api/pollingPosts/",
    data: { lastModified: lastModified },
    timeout: 60000, 
    success: function (res) {
      const data = res;

      if (
        data.server_time > lastModified &&
        data.applications &&
        data.applications.length > 0
      ) {
        content.innerHTML = '';

        data.applications.forEach(application => {
          const applicationHTML = `
            <div class="col-md-4">
              <div class="card">
                <img src="${application.image}" class="card-img-top" alt="${application.title}">
                <div class="card-body">
                  <h5 class="card-title">${application.title}</h5>
                  <p class="card-text">${application.body}</p>
                  <p class="card-text">Slug: ${application.slug}</p>
                </div>
              </div>
            </div>
          `;
          content.innerHTML += applicationHTML; 
        });

        doPolling(data.server_time);
      } else {
        console.log("No update.");
      }
    },
    error: function (error) {
      console.error("Error during polling:", error);

      setTimeout(() => doPolling(lastModified), 5000); 
    },
  });
}

doPolling(0);
