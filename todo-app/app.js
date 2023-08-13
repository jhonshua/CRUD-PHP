$(function () {
  // Global Settings
  let edit = false
  console.log('jquery is working')
  $('#task-result').hide()
  fetchTasks()
  // search
  $('#search').keyup(function () {
    if ($('#search').val()) {
      let search = $('#search').val()
      $.ajax({
        url: 'task-search.php',
        type: 'POST',
        data: { search },
        success: function (response) {
          var tasks = JSON.parse(response)
          let template = ''
          tasks.forEach(task => {
            template += ` <li><a href="#" class="task-item">${task.name}</a></li>`
          })
          $('#task-result').show()
          $('#container').html(template)
        },
      })
    } else {
      $('#task-result').hide()
    }
  })

  // add task
  $('#task-form').submit(function (e) {
    const postData = {
      name: $('#name').val(),
      description: $('#description').val(),
      id: $('#taskId').val(),
    }

    let url = edit === false ? 'task-add.php' : 'task-edit.php'

    $.post(url, postData, function (response) {
      console.log(response)
      $('#task-form').trigger('reset')
      fetchTasks()
    })

    e.preventDefault()
  })

  // search all tasks
  // Fetching Tasks
  function fetchTasks() {
    $.ajax({
      url: 'task-list.php',
      type: 'GET',
      success: function (response) {
        const tasks = JSON.parse(response)
        let template = ''
        tasks.forEach(task => {
          template += `
                  <tr taskId="${task.id}">
                  <td>${task.id}</td>
                  <td>
                  <a href="#" class="task-item">
                    ${task.name} 
                  </a>
                  </td>
                  <td>${task.description}</td>
                  <td>
                    <button class="task-delete btn btn-danger">
                     Delete 
                    </button>
                  </td>
                  </tr>
                `
        })
        $('#tasks').html(template)
      },
    })
  }

  $(document).on('click', '.task-delete', function () {
    if (confirm('Are you sure you want to delete it?')) {
      const element = $(this)[0].parentElement.parentElement
      const id = $(element).attr('taskId')
      $.post('task-delete.php', { id }, function (response) {
        console.log(response)
        fetchTasks()
      })
    }
  })

  // Get a Single Task by Id
  $(document).on('click', '.task-item', function () {
    const element = $(this)[0].parentElement.parentElement
    const id = $(element).attr('taskId')
    $.post('task-single.php', { id }, function (response) {
      const task = JSON.parse(response)
      console.log(task)
      $('#name').val(task.name)
      $('#description').val(task.description)
      $('#taskId').val(task.id)
      edit = true
    })
  })
})
