document.getElementById('submitButton').addEventListener('click', function() {
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();
    
    if (!commentText) {
        alert('Por favor, escribe un comentario');
        return;
    }

    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    
    const commentContent = document.createElement('p');
    commentContent.textContent = commentText;
    
    const dateDiv = document.createElement('div');
    dateDiv.textContent = new Date().toLocaleString();
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.className = 'delete-btn';
    deleteButton.onclick = function() {
        if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
            commentDiv.remove();
        }
    };
    
    commentDiv.appendChild(deleteButton);
    commentDiv.appendChild(commentContent);
    commentDiv.appendChild(dateDiv);
    
    document.getElementById('commentsContainer').insertBefore(commentDiv, document.getElementById('commentsContainer').firstChild);
    
    commentInput.value = '';
});

document.getElementById('commentInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('submitButton').click();
    }
});
