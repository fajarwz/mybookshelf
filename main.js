(function () {
    feather.replace();

    const formAdd = document.getElementById("form-add");
    const formSearch = document.getElementById("form-search");
    const deleteBookBtn = document.getElementsByClassName("delete-book-btn");
    const isCompletedBtn = document.getElementsByClassName("is-completed-btn");

    const title = document.getElementById("title");
    let titleValidation = document.getElementById("title-validation");

    const author = document.getElementById("author");
    const year = document.getElementById("year");
    const isComplete = document.getElementById("is-complete");

    const search = document.getElementById("search");

    const booksInit = JSON.parse(localStorage.getItem("books")) || [];
    loadBooks(booksInit);

    function loadBooks(books) {
        const notCompletedYet = document.getElementById("not-completed-yet");
        const completed = document.getElementById("completed");

        let notCompletedYetHtml = "";
        let completedHtml = "";

        for (const book of books) {
            if (book.isComplete) {
                completedHtml += `
                <div
                    class="bg-white grid grid-cols-5 mb-4 min-h-min rounded-lg p-5 shadow-md"
                >
                    <div class="col-span-4">
                        <div class="text-xl mb-2">
                            <strong>${book.title}</strong>
                        </div>
                        <div class="mb-1">
                            Penulis: ${book.author}
                        </div>
                        <div class="mb-1">Tahun: ${book.year}</div>
                    </div>
                    <div
                        class="col-span-1 flex justify-center items-center"
                    >
                        <button class="mr-2 is-completed-btn" title="Masukkan ke rak Belum Selesai Dibaca" data-id="${book.id}">
                            <i data-feather="check-square"></i>
                        </button>
                        <button class="delete-book-btn" title="Hapus" data-id="${book.id}">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                </div>
                `;
            } else {
                notCompletedYetHtml += `
                <div
                    class="bg-white grid grid-cols-5 mb-4 min-h-min rounded-lg p-5 shadow-md"
                >
                    <div class="col-span-4">
                        <div class="text-xl mb-2">
                            <strong>${book.title}</strong>
                        </div>
                        <div class="mb-1">
                            Penulis: ${book.author}
                        </div>
                        <div class="mb-1">Tahun: ${book.year}</div>
                    </div>
                    <div
                        class="col-span-1 flex justify-center items-center"
                    >
                        <button class="mr-2 is-completed-btn" title="Masukkan ke rak Selesai Dibaca" data-id="${book.id}">
                            <i data-feather="square"></i>
                        </button>
                        <button class="delete-book-btn" title="Hapus" data-id="${book.id}">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                </div>
                `;
            }
        }

        completed.innerHTML = completedHtml;
        notCompletedYet.innerHTML = notCompletedYetHtml;

        setIsCompleteBtnListener();
        setDeleteBtnListener();

        feather.replace();
    }

    function resetForm() {
        title.value = "";
        author.value = "";
        year.value = "";
        isComplete.checked = false;

        title.focus();
    }

    function setIsCompleteBtnListener() {
        for (var i = 0; i < isCompletedBtn.length; i++) {
            isCompletedBtn[i].addEventListener("click", function () {
                const id = parseInt(this.getAttribute("data-id"));
                let books = JSON.parse(localStorage.getItem("books")) || [];

                const indexOfObject = books.findIndex((book) => {
                    return book.id === id;
                });

                books[indexOfObject].isComplete =
                    !books[indexOfObject].isComplete;

                localStorage.setItem("books", JSON.stringify(books));

                loadBooks(books);
            });
        }
    }

    function setDeleteBtnListener() {
        for (var i = 0; i < deleteBookBtn.length; i++) {
            deleteBookBtn[i].addEventListener("click", function () {
                Swal.fire({
                    icon: "question",
                    title: "Yakin ingin hapus buku ini?",
                    showCancelButton: true,
                    confirmButtonText: "Ya",
                    cancelButtonText: "Tidak",
                }).then((result) => {
                    if (result.isConfirmed) {
                        const id = parseInt(this.getAttribute("data-id"));
                        let books =
                            JSON.parse(localStorage.getItem("books")) || [];

                        const indexOfObject = books.findIndex((book) => {
                            return book.id === id;
                        });

                        books.splice(indexOfObject, 1);
                        localStorage.setItem("books", JSON.stringify(books));
                        loadBooks(books);

                        Swal.fire("Buku berhasil dihapus!", "", "success");
                    }
                });
            });
        }
    }

    formAdd.addEventListener("submit", function (e) {
        e.preventDefault();

        if (title.value === "") {
            titleValidation.innerText = "Judul tidak boleh kosong";
            return false;
        }

        titleValidation.innerText = "";

        if (typeof localStorage !== "undefined") {
            let books = JSON.parse(localStorage.getItem("books")) || [];

            const data = {
                id: +new Date(),
                title: title.value,
                author: author.value,
                year: year.value,
                isComplete: isComplete.checked,
            };

            books.push(data);
            localStorage.setItem("books", JSON.stringify(books));

            loadBooks(books);

            resetForm();
        }
    });

    formSearch.addEventListener("submit", function (e) {
        e.preventDefault();

        if (typeof localStorage !== "undefined") {
            const books = JSON.parse(localStorage.getItem("books")) || [];
            const result = books.filter((book) =>
                book.title.toLowerCase().includes(search.value.toLowerCase())
            );

            loadBooks(result);
        } 
    });

    document.getElementById("copyright-year").innerText = new Date().getFullYear();
})();
