const { div, textarea, button, p } = van.tags;

const prompt = van.state('');
const response = van.state('');
const isLoading = van.state(false);
const timings = van.state(null);

const sendRequest = async () => {
  if (!prompt.val.trim() || isLoading.val) return;

  isLoading.val = true;
  response.val = '';
  timings.val = '';

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

    // シンプルなSSEパーサー関数
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

    // 使用例
    await parseSSEStream(fetchResponse.body, (data) => {
      try {
        const json = JSON.parse(data);
        if (json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content) {
          response.val += json.choices[0].delta.content;
        }
        if (json.timings) {
          timings.val = JSON.stringify(json.timings, undefined, 2);
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
    { class: 'grid grid-cols-1 gap-4' },

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
      () => timings.val || ''
    )
  );
};

van.add(document.getElementById('app'), App());
