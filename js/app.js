let employees = $('tr .employee');

(function () {
    $.ajax({
        url: 'http://localhost:3000/employees',
        method: 'GET',
        dataType: 'JSON',
        success: function (data) {
            let employees = data.map((employee) => {
                return `
            <tr class="employee" data-id="${employee.id}" data-name="${employee.name}" data-age="${employee.age}" data-salary="${employee.salary}">
                <td contenteditable="true" class="id">${employee.id}</td>
                <td contenteditable="true" class="name">${employee.name}</td>
                <td contenteditable="true" class="age">${employee.age}</td>
                <td contenteditable="true" class="salary">${employee.salary}</td>
                <td><button class="delete">Delete</button></td>
            </tr>
            `;
            });
            $('table').append(employees);
            employees = $('tr.employee');
        },
    });
})();

let changed = false;

$('table').on('input', 'td', function (e) {
    e.preventDefault();
    $(e.target).parent().data($(e.target).attr('class'), $(e.target).text());
    changed = true;
    $(e.target).parent().addClass('changed');
});

// $('table').on('blur', 'td', function (e) {
//     if (!changed) return;
//     let employee = $(e.target).parent().data();

//     $.ajax({
//         url:
//             'http://localhost:3000/employees/' +
//             $(e.target).parent().data('id'),
//         type: 'PUT',
//         data: JSON.stringify(employee),
//         success: function (data) {
//         },
//         contentType: 'application/json',
//         processData: false,
//     });
//     changed = false;
// });

$('.confirm').on('click', function (e) {
    e.preventDefault();
    $('tr.employee.changed').each((i, employee) => {
        $.ajax({
            url: 'http://localhost:3000/employees/' + $(employee).data('id'),
            type: 'PUT',
            data: JSON.stringify($(employee).data()),
            success: function (data) {
            },
            contentType: 'application/json',
            processData: false,
        });
        changed = false;
    });
});

$('table').on('click', '.delete', function (e) {
    let confirm_delete = confirm(
        'Are you sure you want to delete ' +
            $(e.target).parent().parent().data('name') +
            '?'
    );
    if (!confirm_delete) return;
    $.ajax({
        url:
            'http://localhost:3000/employees/' +
            $(e.target).parent().parent().data('id'),
        type: 'DELETE',
    });
});

$('.add').on('click', function () {
    $(this).parent().after(`
    <tr class="new">
        <td>
        </td>
        <td>
        <input type="text" class="name" placeholder="Name"></input>
        </td>
        <td>
        <input type="text" class="age" placeholder="Age"></input>
        </td>
        <td>
        <input type="text" class="salary" placeholder="Salary"></input>
        </td>
        <td class="confirm-add">Confirm Add
        </td>
    </tr>
    `);

    $('.new').on('click', '.confirm-add', function () {
        let new_employee = {
            name: $('input.name').val(),
            age: $('input.age').val(),
            salary: $('input.salary').val(),
        };

        $.ajax({
            url: 'http://localhost:3000/employees/',
            type: 'POST',
            data: JSON.stringify(new_employee),
            success: function (data) {
            },
            contentType: 'application/json',
            processData: false,
        });
    });
});
