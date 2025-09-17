const { div, textarea, button, p, hr } = van.tags;

const prompt = van.state('');
const response = van.state('');
const isLoading = van.state(false);
const modelName = van.state('');
const resultData = van.state(null);
const localStorageDisplay = van.state('');

const showResults = () => {
  const data = JSON.parse(localStorage.getItem('llmResults') || '[]');
  localStorageDisplay.val = JSON.stringify(data, undefined, 2);
};

const addResult = (resultJson) => {
  const existingData = JSON.parse(localStorage.getItem('llmResults') || '[]');
  const newData = JSON.parse(resultJson);
  existingData.push(newData);
  localStorage.setItem('llmResults', JSON.stringify(existingData));
  showResults();
};

const handleAddClick = () => {
  if (resultData.val) {
    addResult(resultData.val);
  }
};

const getModel = async () => {
  try {
    const fetchResponse = await fetch('http://localhost:8080/v1/models');
    const data = await fetchResponse.json();
    if (data.models && data.models[0] && data.models[0].name) {
      const fullPath = data.models[0].name;
      const fileName = fullPath.split('/').pop();
      modelName.val = fileName;
    }
  } catch (error) {
    console.error('Error fetching model name:', error);
  }
};

const sendRequest = async () => {
  if (!prompt.val.trim() || isLoading.val) return;

  isLoading.val = true;
  response.val = '';
  resultData.val = '';

  try {
    const fetchResponse = await fetch('http://localhost:8080/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt.val
          }
        ],
        stream: true,
        timings_per_token: true
      })
    });

    console.log('Fetch response:', fetchResponse);

    if (!fetchResponse.ok) {
      response.val = `HTTP error! status: ${fetchResponse.status}`;
      isLoading.val = false;
      return;
    }

    function parseSSEStream(stream, onEvent) {
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      return new Promise(async (resolve) => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            resolve();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              onEvent(data);
            }
          }
        }
      });
    }

    await parseSSEStream(fetchResponse.body, (data) => {
      try {
        const json = JSON.parse(data);
        if (json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content) {
          response.val += json.choices[0].delta.content;
        }
        if (json.timings) {
          const enhancedResult = {
            model: modelName.val,
            prompt: prompt.val,
            ...json.timings
          };
          resultData.val = JSON.stringify(enhancedResult, undefined, 2);
        }
      } catch (error) {
        console.error('Parse error:', error);
      }
    });
  } catch (error) {
    response.val = `Error: ${error.message}`;
  } finally {
    isLoading.val = false;
  }
};

const App = () => {
  return div(
    { class: '' },

    div(
      { class: 'max-w-4xl mx-auto grid grid-cols-2 gap-4' },

      div(
        { class: 'col-span-2' },
        textarea(
          {
            value: () => localStorageDisplay.val,
            readonly: true,
            class: 'w-full p-4 border border-neutral-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-neutral-500',
            rows: 16,
          }
        ),
      ),

      div(
        button(
          {
            onclick: handleAddClick,
            class: 'w-full py-2 rounded-md font-medium bg-violet-600 hover:bg-violet-700 text-neutral-100 cursor-pointer'
          },
          'Update'
        )
      ),

      div(
        button(
          {
            onclick: handleAddClick,
            class: 'w-full py-2 rounded-md font-medium bg-indigo-600 hover:bg-indigo-700 text-neutral-100 cursor-pointer'
          },
          'Add'
        )
      ),
    ),

    hr({ class: 'border border-neutral-600 my-4' }),

    div(
      { class: 'max-w-4xl mx-auto grid grid-cols-1 gap-4' },

      div(
        { class: '' },
        () => modelName.val ? `🤖 ${modelName.val}` : 'The server is not running'
      ),

      div(
        { class: '' },
        textarea(
          {
            value: () => prompt.val,
            oninput: (e) => prompt.val = e.target.value,
            placeholder: 'Enter prompt...',
            class: 'w-full p-4 border border-neutral-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-neutral-500',
            rows: 4,
            disabled: () => isLoading.val
          }
        ),
      ),

      div(
        button(
          {
            onclick: sendRequest,
            disabled: () => isLoading.val || !prompt.val.trim(),
            class: () => `w-full py-2 rounded-md font-medium ${isLoading.val || !prompt.val.trim()
                ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 text-neutral-100 cursor-pointer'
              }`
          },
          () => isLoading.val ? 'Sending...' : 'Send'
        )
      ),

      div(
        { class: 'whitespace-pre-wrap' },
        () => response.val || ''
      ),

      div(
        { class: 'whitespace-pre-wrap text-amber-200' },
        () => resultData.val || ''
      )
    )
  );
};

showResults();
getModel();
van.add(document.getElementById('app'), App());
