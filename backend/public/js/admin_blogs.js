console.log("Frontend admin_blogs.ts file loaded successfully.");
import { container } from "./models.js";
// 点击delete按钮后，出现一个遮罩层，出现提示，然后里面有确认和取消按钮
const overlay = document.createElement("div");
overlay.classList.add("overlay");
const confirmDiv = document.createElement("div");
confirmDiv.classList.add("confirmDiv");
const confirmText = document.createElement("p");
confirmText.innerHTML = "Are you sure you want to delete this blog?";
const buttonDiv = document.createElement("div");
buttonDiv.classList.add("buttonDiv");
const cancelButton = document.createElement("button");
cancelButton.textContent = "Cancel";
cancelButton.classList.add("editButton");
const deleteButton = document.createElement("button");
deleteButton.textContent = "delete";
deleteButton.classList.add("deleteButton");
buttonDiv.appendChild(cancelButton);
buttonDiv.appendChild(deleteButton);
confirmDiv.appendChild(confirmText);
confirmDiv.appendChild(buttonDiv);
overlay.appendChild(confirmDiv);
document.body.appendChild(overlay); // 这个overlay要遮住整个页面，所以要直接append给body，如果个container的话，只能遮住container部分
const pagination = document.createElement("div");
pagination.classList.add("pagination");
container.appendChild(pagination);
const addButton = document.createElement("button");
addButton.textContent = "Add New Blog";
addButton.classList.add("addButton");
addButton.addEventListener("click", () => addBlog());
container.appendChild(addButton);
const blogList = document.createElement("div");
blogList.classList.add("blogList");
container.appendChild(blogList);
function deleteBlog(blogId, limit, offset) {
    overlay.style.display = "block"; // Show the overlay
    cancelButton.onclick = () => {
        overlay.style.display = "none"; // Hide the overlay on cancel
    };
    deleteButton.onclick = async () => {
        overlay.style.display = "none"; // Hide the overlay after confirmation
        // Proceed with the deletion
        console.log(`Deleting blog with ID: ${blogId}`);
        try {
            const response = await fetch(`/api/blogs/${blogId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            console.log(`Blog with ID ${blogId} deleted successfully.`);
            // Re-fetch and render the blog list after deletion
            fetchAndRenderBlogList(limit, offset);
        }
        catch (error) {
            console.error("Error deleting blog:", error);
        }
    };
}
async function editBlog(blogId) {
    console.log(`Editing blog with ID: ${blogId}`);
    // Redirect to the edit blog page with the blog ID
    window.location.href = `/admin/blogs/edit/${blogId}`; // Redirect to the edit blog page
}
async function addBlog() {
    console.log("Adding new blog");
    window.location.href = "/admin/blogs/add"; // Redirect to the add blog page
}
async function fetchAndRenderBlogList(limit = 20, offset = 0) {
    try {
        const response = await fetch(`/api/blogs?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const blogs = await response.json();
        // console.log("Fetched blogs:", blogs);
        if (blogs.total === 0) {
            blogList.innerHTML = "<h2>No blog content at current.</h2>";
            return;
        }
        blogList.innerHTML = ""; // Clear previous blog list
        blogs.data.forEach((blog) => {
            const blogDiv = document.createElement("div");
            blogDiv.classList.add("blogLine");
            const infoDiv = document.createElement("div");
            infoDiv.classList.add("infoDiv");
            const bloCreatedAt = document.createElement("p");
            bloCreatedAt.textContent = blog.created_at.split(" ")[0];
            const blogTitle = document.createElement("h3");
            blogTitle.innerHTML = `<a href="/pages/${blog.id}">${blog.title}</a>`;
            infoDiv.appendChild(bloCreatedAt);
            infoDiv.appendChild(blogTitle);
            const buttonDiv = document.createElement("div");
            buttonDiv.classList.add("buttonDiv");
            const blogDeleteButton = document.createElement("button");
            blogDeleteButton.textContent = "Delete";
            blogDeleteButton.classList.add("deleteButton");
            blogDeleteButton.addEventListener("click", () => {
                deleteBlog(blog.id, limit, offset);
            });
            const blogEditButton = document.createElement("button");
            blogEditButton.textContent = "Edit";
            blogEditButton.classList.add("editButton");
            blogEditButton.addEventListener("click", () => {
                editBlog(blog.id);
            });
            buttonDiv.appendChild(blogDeleteButton);
            buttonDiv.appendChild(blogEditButton);
            blogDiv.appendChild(infoDiv);
            blogDiv.appendChild(buttonDiv);
            blogList.appendChild(blogDiv);
        });
        // Render pagination
        renderPagination(blogs.total, limit, offset);
    }
    catch (error) {
        console.error("Error fetching blogs:", error);
        blogList.innerHTML = "<h2>Error loading blogs.</h2>";
    }
}
function renderPagination(total, limit, offset) {
    pagination.innerHTML = ""; // Clear previous pagination
    let totalPages = Math.ceil((total) / limit);
    let currentPage = Math.floor((offset) / limit) + 1; // Calculate current page based on offset
    console.log(total);
    console.log(`Total pages: ${totalPages}, Current page: ${currentPage}`);
    let startPage = currentPage - 2; // Start from 2 pages before the current page
    if (startPage < 1) {
        startPage = 1; // Ensure we don't go below page 1
    }
    let endPage = startPage + 4; // Show 5 pages in total
    if (endPage > totalPages) {
        endPage = totalPages; // Ensure we don't go above the total pages
        startPage = endPage - 4 > 0 ? endPage - 4 : 1; // Adjust start page if end page is at the limit
    }
    // console.log(`Pagination range: ${startPage} to ${endPage}`);
    // Add "Previous" button
    const prevButton = document.createElement("button");
    prevButton.textContent = "<<";
    prevButton.classList.add("prev");
    if (currentPage > 1) {
        prevButton.addEventListener("click", () => {
            fetchAndRenderBlogList(limit, offset - limit);
        });
        pagination.appendChild(prevButton);
    }
    else {
        prevButton.disabled = true; // Disable if on the first page
        prevButton.classList.add("disabled");
        pagination.appendChild(prevButton);
    }
    // Add numbered page buttons
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i.toString();
        pageButton.classList.add("page");
        if (i === currentPage) {
            pageButton.classList.add("active"); // Highlight the current page
        }
        else {
            pageButton.addEventListener("click", () => {
                let newOffset = (i - 1) * limit; // Calculate new offset based on page number
                fetchAndRenderBlogList(limit, newOffset);
            });
        }
        pagination.appendChild(pageButton);
    }
    // add "Next" button
    const nextButton = document.createElement("button");
    nextButton.textContent = ">>";
    nextButton.classList.add("next");
    if (currentPage < totalPages) {
        nextButton.addEventListener("click", () => {
            fetchAndRenderBlogList(limit, offset + limit);
        });
        pagination.appendChild(nextButton);
    }
    else {
        nextButton.disabled = true; // Disable if on the last page
        nextButton.classList.add("disabled");
        pagination.appendChild(nextButton);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    fetchAndRenderBlogList();
});
