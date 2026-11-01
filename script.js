(() => {
  const MASTER_PASSWORD = 'shamelle';
  const $ = id => document.getElementById(id);
  const pages = ['loginPage', 'foldersPage', 'passwordPage', 'editorPage'];
  let activeFolder = null;

  const keys = {
    password: folder => `loveletters_${folder}_password`,
    title: folder => `loveletters_${folder}_title`,
    body: folder => `loveletters_${folder}_body`
  };

  function show(page) {
    pages.forEach(id => $(id).classList.toggle('hidden', id !== page));
    $('masterError').textContent = '';
    $('folderError').textContent = '';
  }

  function folderName(folder) {
    return folder === 'saksham' ? 'Letter to Saksham' : 'Letter to Jhenelle';
  }

  function refreshStatuses() {
    ['saksham', 'jhenelle'].forEach(folder => {
      $(`status-${folder}`).textContent = localStorage.getItem(keys.password(folder))
        ? '🔒 Password set'
        : '♡ Password not set yet';
    });
  }

  // Master login
  $('masterForm').addEventListener('submit', event => {
    event.preventDefault();
    if ($('masterPassword').value === MASTER_PASSWORD) {
      $('masterPassword').value = '';
      refreshStatuses();
      show('foldersPage');
    } else {
      $('masterError').textContent = 'That password doesn’t match. Try again. ♡';
      $('masterPassword').select();
    }
  });

  $('lockButton').addEventListener('click', () => { show('loginPage'); });

  // Choose a folder
  document.querySelectorAll('[data-folder]').forEach(button =>
    button.addEventListener('click', () => {
      activeFolder = button.dataset.folder;
      const alreadySet = !!localStorage.getItem(keys.password(activeFolder));
      $('passwordTitle').textContent = alreadySet
        ? `Open ${folderName(activeFolder)}`
        : `Set up ${folderName(activeFolder)}`;
      $('passwordSubtitle').textContent = alreadySet
        ? 'Enter the password for this folder.'
        : 'Choose a password now. It can only be set once in this browser.';
      $('folderPasswordLabel').textContent = alreadySet ? 'Folder password' : 'Create folder password';
      $('folderPassword').value = '';
      $('confirmPassword').value = '';
      $('confirmWrap').classList.toggle('hidden', alreadySet);
      $('passwordSubmit').textContent = alreadySet ? 'Open folder 💌' : 'Set password & open 💌';
      show('passwordPage');
      $('folderPassword').focus();
    })
  );

  // Folder password
  $('folderPasswordForm').addEventListener('submit', event => {
    event.preventDefault();
    if (!activeFolder) return;
    const savedPassword = localStorage.getItem(keys.password(activeFolder));
    const entered = $('folderPassword').value;

    if (savedPassword) {
      if (entered !== savedPassword) {
        $('folderError').textContent = 'Incorrect folder password. Please try again.';
        return;
      }
    } else {
      if (entered.trim().length < 4) {
        $('folderError').textContent = 'Choose at least 4 characters for your password.';
        return;
      }
      if (entered !== $('confirmPassword').value) {
        $('folderError').textContent = 'The passwords do not match.';
        return;
      }
      localStorage.setItem(keys.password(activeFolder), entered);
    }
    openEditor();
  });

  // Editor
  function openEditor() {
    $('editorTitle').textContent = folderName(activeFolder);
    $('letterTitle').value = localStorage.getItem(keys.title(activeFolder)) || '';
    $('letterBody').value = localStorage.getItem(keys.body(activeFolder)) || '';
    $('saveStatus').textContent = '';
    show('editorPage');
  }

  $('saveLetter').addEventListener('click', () => {
    localStorage.setItem(keys.title(activeFolder), $('letterTitle').value);
    localStorage.setItem(keys.body(activeFolder), $('letterBody').value);
    $('saveStatus').textContent = 'Saved just now ✓';
  });

  $('clearLetter').addEventListener('click', () => {
    if (confirm('Clear the text from the editor? This does not delete the saved letter.')) {
      $('letterTitle').value = '';
      $('letterBody').value = '';
      $('saveStatus').textContent = 'Editor cleared (not saved)';
    }
  });

  // Navigation
  $('backFromPassword').addEventListener('click', () => { refreshStatuses(); show('foldersPage'); });
  $('backFromEditor').addEventListener('click', () => { refreshStatuses(); show('foldersPage'); });
  $('closeLetter').addEventListener('click', () => { refreshStatuses(); show('foldersPage'); });
})();
