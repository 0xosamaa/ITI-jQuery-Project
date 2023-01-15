let employees = $('tr .employee');

const employeesTable = () => {
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
            $('table .employee').remove();
            $('table').append(employees);
            employees = $('tr.employee');
        },
    });
};
employeesTable();

let changed = false;

$('table').on('input', 'td', function (e) {
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
    $('tr.employee.changed').each((i, employee) => {
        if (
            !validInput(
                $(employee).data('name'),
                $(employee).data('age'),
                $(employee).data('salary')
            )
        ) {
            return;
        }

        $.ajax({
            url: 'http://localhost:3000/employees/' + $(employee).data('id'),
            type: 'PUT',
            data: JSON.stringify($(employee).data()),
            success: function () {
                employeesTable();
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
        success: function () {
            employeesTable();
        },
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

        if (
            !validInput(
                new_employee.name,
                new_employee.age,
                new_employee.salary
            )
        ) {
            return;
        }

        $.ajax({
            url: 'http://localhost:3000/employees/',
            type: 'POST',
            data: JSON.stringify(new_employee),
            success: function () {
                $('.new').remove();
                employeesTable();
            },
            contentType: 'application/json',
            processData: false,
        });
    });
});

const validInput = (name, age, salary) => {
    let say = '';
    if (name.length > 30 || /\d/.test(name)) {
        say = 'Please enter a valid name';
        $('.error-msg').css('display', 'block');
        $('.error-msg').text(say);
        return false;
    }
    if (age > 60 || age < 20 || isNaN(age)) {
        say = 'Please enter a valid age';
        $('.error-msg').css('display', 'block');
        $('.error-msg').text(say);
        return false;
    }
    if (isNaN(salary)) {
        say = 'Please enter a valid salary';
        $('.error-msg').css('display', 'block');
        $('.error-msg').text(say);
        return false;
    }
    say = 'Submission successful';

    $('.error-msg').css('display', 'none');
    $('.error-msg').empty();
    $('.success-msg').css('display', 'block');
    $('.success-msg').text(say);
    setTimeout(() => {
        $('.success-msg').css('display', 'none');
        $('.success-msg').empty();
    }, 3000);
    return true;
};
