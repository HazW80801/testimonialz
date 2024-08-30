// public/widget.js
(function () {
    const scriptElement = document.currentScript;
    if (!scriptElement) return; // Ensure currentScript is not null
    const formId = scriptElement.getAttribute('data-form-id');
    const apiUrl = `https://testimonialz-lake.vercel.app/api/prisma/fetchTestimonials?formId=${formId}&publicT=true`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(testimonials => {
            const wrapper = document.createElement('div');
            wrapper.className = 'testimonial-widget';
            // {{ edit_1 }}
            document.body.className = ''; // Remove all classes from body
            while (document.body.firstChild) { // Remove all children from body
                document.body.removeChild(document.body.firstChild);
            }
            document.body.appendChild(wrapper); // Append the wrapper to body
            testimonials.forEach((testimonial) => {
                const testimonialElement = document.createElement('div');
                testimonialElement.className = 'testimonial';
                testimonialElement.innerHTML = `
                   ${testimonial.type == "video" ?
                        ` <div class="testimonial-content_video">
                            <video src=${testimonial.content} controls muted />
                        </div>` :
                        `  <div class="testimonial-content_text">
                            <p>"${testimonial.content}"</p>
                        </div>`
                    }
                    <div class="testimonial-author-details">
                      ${testimonial.author.photo ?
                        `<img src="${testimonial.author.photo}" alt="${testimonial.author.name}"
                        class="testimonial-author-image" />` : ""}
                        <span class="testimonial-labels-wrap">
                        <span class="testimonial-author-name">${testimonial.author.name}</span>
                        ${testimonial.author.job ? `<span class="testimonial-author-label">${testimonial.author.job}</span>` : ''}
                        ${testimonial.author.company ? `<span class="testimonial-author-company">${testimonial.author.company}</span>` : ''}
                    </span>
                        </div>`;
                wrapper.append(testimonialElement);
            });
        })
        .catch(error => console.error('Error loading testimonials:', error));
})();