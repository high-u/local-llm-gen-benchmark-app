const { div, textarea, button, p, hr, input } = van.tags;

const SAMPLING_INTERVAL = 10000;

const prompt = van.state('');
const response = van.state('');
const responseReasoning = van.state('');
const isLoading = van.state(false);
const modelName = van.state('');
const resultData = van.state(null);
const localStorageDisplay = van.state('');
const isJsonError = van.state(false);
const isGetModelLoading = van.state(false);
const comment = van.state('');
const server = van.state('');
const abortController = van.state(null);
const errorMessage = van.state('');
const predictedSpeedSamples = van.state([]);
const nextSamplingInterval = van.state(SAMPLING_INTERVAL);

const resetState = {
  all: () => {
    response.val = '';
    responseReasoning.val = '';
    resultData.val = '';
    errorMessage.val = '';
    abortController.val = null;
  },
  
  cancel: () => {
    abortController.val = null;
    errorMessage.val = '';
  }
};

const showResults = () => {
  const data = JSON.parse(localStorage.getItem('llmResults') || '[]');
  localStorageDisplay.val = JSON.stringify(data, undefined, 2);
};

const addResult = (resultJson) => {
  const existingData = JSON.parse(localStorage.getItem('llmResults') || '[]');
  const newData = {
    ...JSON.parse(resultJson),
    server: server.val.trim(),
    comment: comment.val.trim(),
    generated: response.val,
    reasoning: responseReasoning.val
  };
  const updatedData = [newData, ...existingData];
  localStorage.setItem('llmResults', JSON.stringify(updatedData));
  showResults();
};

const handleAddClick = () => {
  if (resultData.val) {
    addResult(resultData.val);
    server.val = '';
    comment.val = '';
  }
};

const handleUpdateClick = () => {
  const textValue = localStorageDisplay.val.trim();
  
  if (textValue === '') {
    localStorage.setItem('llmResults', JSON.stringify([]));
    localStorageDisplay.val = JSON.stringify([], undefined, 2);
    isJsonError.val = false;
    return;
  }
  
  try {
    const parsedData = JSON.parse(textValue);
    if (Array.isArray(parsedData)) {
      localStorage.setItem('llmResults', JSON.stringify(parsedData));
      localStorageDisplay.val = JSON.stringify(parsedData, undefined, 2);
      isJsonError.val = false;
    } else {
      isJsonError.val = true;
    }
  } catch (error) {
    isJsonError.val = true;
  }
};

const handleGetModelClick = async () => {
  isGetModelLoading.val = true;
  resetState.all();
  await getModel();
  
  const savedPrompt = localStorage.getItem('savedPrompt');
  if (savedPrompt) {
    prompt.val = savedPrompt;
  }
  
  isGetModelLoading.val = false;
};

const savePrompt = () => {
  localStorage.setItem('savedPrompt', prompt.val);
};

const getModel = async () => {
  try {
    const fetchResponse = await fetch('http://localhost:8080/v1/models');
    const data = await fetchResponse.json();
    console.log({data});

    // 既存の形式を優先的にチェック
    if (data.models && data.models[0] && data.models[0].name) {
      modelName.val = data.models[0].name;
    }
    // 新しい形式（OpenAI互換）をフォールバック
    else if (data.data && data.data[0] && data.data[0].id) {
      modelName.val = data.data[0].id;
    }
    else {
      modelName.val = '';
    }
  } catch (error) {
    console.error('Error fetching model name:', error);
    modelName.val = '';
  }
};

const handleCancelRequest = () => {
  if (abortController.val) {
    abortController.val.abort();
    resetState.cancel();
    isLoading.val = false;
  }
};

const sendRequest = async () => {
  if (!prompt.val.trim() || isLoading.val) return;

  isLoading.val = true;
  resetState.all();

  predictedSpeedSamples.val = [];
  nextSamplingInterval.val = SAMPLING_INTERVAL;

  // timingsを返さないサーバー用の計測変数
  let clientStartTime = null;
  let clientChunkCount = 0;
  let clientUsageData = null;

  try {
    abortController.val = new AbortController();
    
    const fetchResponse = await fetch('http://localhost:8080/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName.val,
        messages: [
          {
            role: 'user',
            content: prompt.val
          }
        ],
        stream: true,
        timings_per_token: true,
        max_tokens: 32768
      }),
      signal: abortController.val.signal
    });

    if (!fetchResponse.ok) {
      errorMessage.val = `HTTP error! status: ${fetchResponse.status}`;
      return;
    }

    const parseSSEStream = (stream, onEvent) => {
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      return new Promise(async (resolve) => {
        try {
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
        } catch (error) {
          if (error.name === 'AbortError') {
            errorMessage.val = `Error: ${error.message}`;
          }
          resolve();
        }
      });
    }

    await parseSSEStream(fetchResponse.body, (data) => {
      const json = JSON.parse(data);
      if (json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content) {
        response.val += json.choices[0].delta.content;
      }
      if (json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.reasoning_content) {
        responseReasoning.val += json.choices[0].delta.reasoning_content;
      }
      window.scrollTo(0, document.body.scrollHeight);
      if (json.timings) {
        if (json.timings.predicted_ms && json.timings.predicted_per_second) {
          if (json.timings.predicted_ms >= nextSamplingInterval.val) {
            const newSamples = [...predictedSpeedSamples.val, json.timings.predicted_per_second];
            predictedSpeedSamples.val = newSamples;
            nextSamplingInterval.val += SAMPLING_INTERVAL;
          }
        }

        const enhancedResult = {
          model: modelName.val,
          prompt: prompt.val,
          ...json.timings,
          predicted_per_second_samples: predictedSpeedSamples.val
        };
        resultData.val = JSON.stringify(enhancedResult, undefined, 2);
      } else {
        // timingsを返さないサーバーの場合
        const hasContent = json.choices && json.choices[0] && json.choices[0].delta &&
                          (json.choices[0].delta.content || json.choices[0].delta.reasoning_content);

        if (hasContent) {
          if (clientStartTime === null) {
            clientStartTime = Date.now();
          }
          clientChunkCount++;

          // チャンクごとに計算
          const elapsedMs = Date.now() - clientStartTime;
          const speed = (clientChunkCount / elapsedMs) * 1000;
          const predictedPerTokenMs = clientChunkCount > 0 ? elapsedMs / clientChunkCount : 0;

          // 10秒ごとにサンプリング配列に追加
          if (elapsedMs >= nextSamplingInterval.val) {
            const newSamples = [...predictedSpeedSamples.val, speed];
            predictedSpeedSamples.val = newSamples;
            nextSamplingInterval.val += SAMPLING_INTERVAL;
          }

          // チャンクごとに表示を更新
          const clientResult = {
            model: modelName.val,
            prompt: prompt.val,
            cache_n: 0,
            prompt_n: 0,
            prompt_ms: 0,
            prompt_per_token_ms: 0,
            prompt_per_second: 0,
            predicted_n: clientChunkCount,
            predicted_ms: elapsedMs,
            predicted_per_token_ms: predictedPerTokenMs,
            predicted_per_second: speed,
            predicted_per_second_samples: predictedSpeedSamples.val
          };
          resultData.val = JSON.stringify(clientResult, undefined, 2);
        }

        if (json.usage) {
          clientUsageData = json.usage;
        }
      }
    });

    // timingsを返さないサーバーの最終結果を作成
    if (clientStartTime !== null && clientUsageData !== null) {
      const totalElapsedMs = Date.now() - clientStartTime;
      const predictedN = clientUsageData.completion_tokens || 0;
      const promptN = clientUsageData.prompt_tokens || 0;
      const predictedPerTokenMs = predictedN > 0 ? totalElapsedMs / predictedN : 0;
      const predictedPerSecond = totalElapsedMs > 0 ? (predictedN / totalElapsedMs) * 1000 : 0;

      const clientResult = {
        model: modelName.val,
        prompt: prompt.val,
        cache_n: 0,
        prompt_n: promptN,
        prompt_ms: 0,
        prompt_per_token_ms: 0,
        prompt_per_second: 0,
        predicted_n: predictedN,
        predicted_ms: totalElapsedMs,
        predicted_per_token_ms: predictedPerTokenMs,
        predicted_per_second: predictedPerSecond,
        predicted_per_second_samples: predictedSpeedSamples.val
      };
      resultData.val = JSON.stringify(clientResult, undefined, 2);
    }
  } catch (error) {
    errorMessage.val = `Error: ${error.message}`;
  } finally {
    isLoading.val = false;
    abortController.val = null;
  }
};

const App = () => {
  return div(
    { class: 'min-h-screen text-neutral-200 font-mono bg-neutral-900' },
    div(
      { class: 'py-8 max-w-4xl mx-auto grid grid-cols-2 gap-4' },
      div(
        { class: 'col-span-2' },
        textarea(
          {
            value: () => localStorageDisplay.val,
            oninput: (e) => {
              localStorageDisplay.val = e.target.value;
              isJsonError.val = false;
            },
            spellcheck: false,
            class: () => `w-full p-4 border border-neutral-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-neutral-500 ${isJsonError.val ? 'text-rose-400' : ''}`,
            rows: 16,
          }
        ),
      ),
      div(
        { class: 'col-span-2' },
        input(
          {
            value: () => server.val,
            oninput: (e) => server.val = e.target.value,
            placeholder: 'Server...',
            spellcheck: false,
            class: 'w-full p-4 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500',
            type: 'text'
          }
        ),
      ),
      div(
        { class: 'col-span-2' },
        input(
          {
            value: () => comment.val,
            oninput: (e) => comment.val = e.target.value,
            placeholder: 'Comment...',
            spellcheck: false,
            class: 'w-full p-4 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500',
            type: 'text'
          }
        ),
      ),
      div(
        button(
          {
            onclick: handleUpdateClick,
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
          'Add result'
        )
      ),
    ),
    hr({ class: 'border border-neutral-700' }),
    div(
      { class: 'py-8 max-w-4xl mx-auto grid grid-cols-3 gap-4' },
      div(
        { class: 'col-span-3' },
        () => modelName.val ? `🤖 ${modelName.val}` : 'The server is not running'
      ),
      div(
        { class: 'col-span-3' },
        textarea(
          {
            value: () => prompt.val,
            oninput: (e) => prompt.val = e.target.value,
            placeholder: 'Enter prompt...',
            spellcheck: false,
            class: 'w-full p-4 border border-neutral-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-neutral-500',
            rows: 16,
            disabled: () => isLoading.val
          }
        ),
      ),
      div(
        button(
          {
            onclick: handleGetModelClick,
            disabled: () => isGetModelLoading.val,
            class: () => `w-full py-2 rounded-md font-medium ${isGetModelLoading.val
                ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                : 'bg-lime-600 hover:bg-lime-700 text-neutral-100 cursor-pointer'
              }`
          },
          () => isGetModelLoading.val ? 'Getting...' : 'Reset'
        )
      ),
      div(
        button(
          {
            onclick: savePrompt,
            class: 'w-full py-2 rounded-md font-medium bg-yellow-600 hover:bg-yellow-700 text-neutral-100 cursor-pointer'
          },
          'Save prompt'
        )
      ),
      div(
          button(
            {
              onclick: sendRequest,
              disabled: () => isLoading.val || !prompt.val.trim() || !modelName.val,
              class: () => `w-full py-2 rounded-md font-medium ${isLoading.val || !prompt.val.trim() || !modelName.val
                  ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700 text-neutral-100 cursor-pointer'
                }`
            },
            () => isLoading.val ? 'Sending...' : 'Send'
          )
      ),
    ),
    div(
      { class: 'py-8 max-w-4xl mx-auto' },
      div(
        { class: 'whitespace-pre-wrap text-neutral-600' },
        () => responseReasoning.val || ''
      ),
    ),
    div(
      { class: 'py-8 max-w-4xl mx-auto' },
      div(
        { class: 'whitespace-pre-wrap' },
        () => response.val || ''
      ),
    ),
    div(
      { class: 'py-8 max-w-4xl mx-auto' },
      div(
        { class: 'whitespace-pre-wrap text-neutral-600' },
        () => resultData.val || ''
      )
    ),
    div(
      { class: 'py-8 max-w-4xl mx-auto' },
      div(
        { class: 'whitespace-pre-wrap text-rose-700' },
        () => errorMessage.val || ''
      )
    )
  );
};

const savedPrompt = localStorage.getItem('savedPrompt') || '';
prompt.val = savedPrompt;

showResults();
getModel();

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isLoading.val) {
    handleCancelRequest();
  }
});

van.add(document.body, App());
