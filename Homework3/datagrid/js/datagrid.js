"use strict";
function DataGrid(args) {
    this.data = args.data;
    this.rootElement = args.rootElement;
    this.columns = args.columns;
    this.pageSize = args.pageSize;
    this.onRender = args.onRender;

    /**
     * Count how many rows in the dataset
     * @return {number}
     */
    this.countRow = function () {
        if (typeof(this.data) !== 'undefined') {
            return this.data.length;
        }
    };

    this.numRows = this.countRow();

    /**
     * Set default current page
     * @type {number}
     */
    this.currentpage = 1;

    /**
     * Set default row number for from
     * @type {number}
     */
    this.from = 1;

    /**
     * Initialize the to value if necessary
     */
    this.getInitialToNum = function () {
        if (typeof (this.pageSize) !== 'undefined' && this.numRows > this.pageSize) {
            var to = this.pageSize;
            return to;
        }
    };

    this.to = this.getInitialToNum();

    /**
     * Count how many pages if necessary
     * @returns {number}
     */
    this.countPages = function () {
        var rows = this.numRows;

        if (typeof(this.pageSize) !== undefined && rows > this.pageSize) {

            var pages = Math.ceil(rows / this.pageSize);
            return pages;
        }
    };

    this.pages = this.countPages();

    /**
     * Check if pager is necessary to use
     * @return {boolean}
     */
    this.checkPager = function () {
        if (typeof (this.pageSize) === 'undefined') {
            return false;
        }
        if (typeof (this.pages) !== 'undefined') {
            return true;
        }
    };

    this.usePager = this.checkPager();

    /**
     * Create an initialize function
     */
    this.init = function () {
        if (typeof(this.columns) !== 'undefined') {

            this.sort(this.columns[0].dataName);

            var markedcol = this.columns[0].dataName;

            var col = this.rootElement.getElementsByClassName(this.columns[0].dataName);
            for (var i = 0; i < col.length; i++) {

                col[i].id += "marked";

            }
            return markedcol;
        }
    };
    /**
     * Initialize the method
     */
    this.markedCol = this.init();

}

(function () {

    /**
     * Destory the grid
     */
    DataGrid.prototype.destroy = function () {
        if (typeof(this.rootElement) !== 'undefined') {
            this.rootElement.innerHTML = "";
        }
    };

    /**
     * Sort the data ascendingly
     * @param text
     */
    DataGrid.prototype.sort = function (text) {

        this.data.sort(
            function (a, b) {
                if (a[text] > b[text]) {
                    return 1;
                } else if (a[text] < b[text]) {
                    return -1;
                } else {
                    return 0;
                }
            }
        );
        if (this.usePager) {
            this.renderPagerGrid(this.to);
        } else {
            this.renderGrid();
        }
    };

    /**
     * Sort the data descendingly
     * @param text
     */
    DataGrid.prototype.reverse = function (text) {
        this.data.reverse(
            function (a, b) {
                if (a[text] < b[text]) {
                    return 1;
                } else if (a[text] > b[text]) {
                    return -1;
                } else {
                    return 0;
                }
            }
        );

        if (this.usePager) {
            this.renderPagerGrid(this.to);
        } else {
            this.renderGrid();
        }
    };




    /**
     * Calculate the data row num when go to the previous page
     * @param event
     */
    DataGrid.prototype.prev = function (event) {
        if (typeof(event.target) !== 'undefined') {
            // if the current page is the first page, it cannot go to the previous page and the event listener will be invalid
            if (this.currentpage === 1) {
                event.preventDefault();
            } else {
                // update the current page and from, to number
                if (this.currentpage > 1) {
                    this.currentpage -= 1;
                }
                this.from = (this.currentpage - 1) * this.pageSize + 1;
                this.to = this.from + this.pageSize - 1;

                this.renderPagerGrid(this.to);
                // track the sorted column
                var col = this.rootElement.getElementsByClassName(this.markedCol);
                for (var i = 0; i < col.length; i++) {
                    col[i].id += "marked";
                }
            }
        }
    };

    /**
     * Calculate the data row num when go to the next page
     * @param event
     */
    DataGrid.prototype.next = function (event) {
        if (typeof(event.target) !== 'undefined') {
            // if the current page is the first page, it cannot go to the next page and the event listener will be invalid
            if (this.currentpage === this.pages) {
                event.preventDefault();
            } else {
                // update the current page and from, to number
                if (this.currentpage < this.pages) {
                    this.currentpage += 1;
                }
                this.from = (this.currentpage - 1) * this.pageSize + 1;

                if (this.currentpage === this.pages) {
                    this.to = this.numRows;
                } else {
                    this.to = this.from + this.pageSize - 1;
                }

                this.renderPagerGrid(this.to);

                // track the sorted column
                var col = this.rootElement.getElementsByClassName(this.markedCol);
                for (var i = 0; i < col.length; i++) {
                    col[i].id += "marked";
                }
            }
        }
    };

    /**
     * Render the grid with pager
     * @param to
     */
    DataGrid.prototype.renderPagerGrid = function () {
        // Clear the window every time the grid is rendered.
        this.destroy();

        if (typeof(this.onRender) !== 'undefined') {
            this.onRender();
        }

        // Create the grid
        var table = document.createElement("table");
        var thead = document.createElement("thead");
        var tr = document.createElement("tr");

        // Create the table header
        for (var c in this.columns) {
            var th = document.createElement("th");
            th.innerHTML = this.columns[c].name;
            th.setAttribute("align", this.columns[c].align);
            th.setAttribute("dataname", this.columns[c].dataName);
            th.setAttribute("title", "Sort by " + this.columns[c].name);
            th.addEventListener("click", this.onclick.bind(this), false);
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);
        // table body
        var tbody = document.createElement("tbody");
        var counter = 1;
        for (var d in this.data) {
            if (counter >= this.from && counter <= this.to) {
                var tr1 = document.createElement("tr");
                for (var c1 in this.columns) {
                    var td = document.createElement("td");
                    var text = this.columns[c1].dataName;
                    td.innerHTML = this.data[d][text];
                    td.setAttribute("class", text);
                    td.setAttribute("align", this.columns[c1].align);
                    td.setAttribute("id", "");
                    tr1.appendChild(td);
                }
                tbody.appendChild(tr1);
            }
            counter += 1;
        }
        table.appendChild(tbody);

        // Create the pager
        var caption = document.createElement("caption");
        var prevnav = document.createElement("span");
        prevnav.innerHTML = "&#8249 Previous ";
        prevnav.setAttribute("id", "previous");
        if (this.currentpage === 1) {
            prevnav.setAttribute("id", "firstpage");

        }

        var nextnav = document.createElement("span");
        nextnav.innerHTML = " Next &#8250 ";
        nextnav.setAttribute("id", "next");
        if (this.currentpage === this.pages) {
            nextnav.setAttribute("id", "lastpage");
        }

        var pagecontent = document.createElement("span");
        pagecontent.innerHTML = this.currentpage + " of " + this.countPages();
        caption.appendChild(prevnav);
        caption.appendChild(pagecontent);
        caption.appendChild(nextnav);

        prevnav.addEventListener("click", this.prev.bind(this), false);
        nextnav.addEventListener("click", this.next.bind(this), false);

        table.insertBefore(caption, table.childNodes[0]);

        // add the table to the root element if applicable
        if (typeof(this.rootElement) !== 'undefined') {
            this.rootElement.appendChild(table);
        }
    };

    /**
     * Render the simple grid
     */
    DataGrid.prototype.renderGrid = function () {
        // Clear the window every time the grid is rendered.
        this.destroy();
        if (typeof(this.onRender) !== 'undefined') {
            this.onRender();
        }
        // Create the table
        var table = document.createElement("table");
        var thead = document.createElement("thead");
        var tr = document.createElement("tr");
        // table header
        for (var c in this.columns) {
            var th = document.createElement("th");
            th.innerHTML = this.columns[c].name;
            th.setAttribute("align", this.columns[c].align);
            th.setAttribute("dataname", this.columns[c].dataName);
            th.setAttribute("title", "Sort by " + this.columns[c].name);
            th.addEventListener("click", this.onclick.bind(this), false);

            tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);
        // table body
        var tbody = document.createElement("tbody");
        for (var d in this.data) {
            var tr1 = document.createElement("tr");
            for (var c1 in this.columns) {
                var td = document.createElement("td");
                var text = this.columns[c1].dataName;
                td.innerHTML = this.data[d][text];
                td.setAttribute("class", text);
                td.setAttribute("align", this.columns[c1].align);
                td.setAttribute("id", "");
                tr1.appendChild(td);
            }
            tbody.appendChild(tr1);
        }
        table.appendChild(tbody);

        // add the table to the root element if applicable
        if (typeof(this.rootElement) !== 'undefined') {
            this.rootElement.appendChild(table);
        }
    };

    /**
     * Create function to control operation on columns on the headers
     * @param event
     */
    DataGrid.prototype.onclick = function (event) {
        if (typeof(event.target) !== 'undefined' && this.rootElement !== 'undefined') {
            var colname = event.target.getAttribute("dataname");
            var col = this.rootElement.getElementsByClassName(colname);

            // if the chosen column was marked as clicked, then reverse; Otherwise, sort it
            if (col[0].className === colname + " clicked") {
                this.reverse(colname);
            } else {
                this.sort(colname);
                col[0].className += " clicked";
            }
            col = this.rootElement.getElementsByClassName(colname);
            // Track the sorted column
            this.markedCol = colname;
            for (var i = 0; i < col.length; i++) {
                col[i].id += "marked";
            }
        }
    };
})(window);


