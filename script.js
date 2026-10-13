(() => {
  // --- Expand / collapse project cards ---
  const cards = [...document.querySelectorAll('.project-card')];
  cards.forEach(card => {
    const btn = card.querySelector('.project-card-header');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        card.classList.toggle('open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
      });
    }
  });

  // --- Copy email ---
  const copy = document.getElementById('copy');
  if (copy) {
    copy.addEventListener('click', async () => {
      try {
        const emailEl = document.querySelector('a.email');
        const emailText = emailEl ? emailEl.textContent.trim() : 'anilaygun335@gmail.com';
        await navigator.clipboard.writeText(emailText);
        copy.textContent = 'Email address copied';
      } catch {
        copy.textContent = 'Copy failed — select the address above';
      }
      setTimeout(() => (copy.textContent = 'Copy email address'), 2200);
    });
  }

  // --- Interactive MySQL Query Console ---
  const consoleBox = document.getElementById('project-console');
  const queryTail = document.getElementById('query-tail');
  const countEl = document.getElementById('projects-count');
  const allTagPills = [...document.querySelectorAll('#work .tag-pill')];
  
  let activeTag = '';
  let typingTimer = null;

  function filterProjects(tag) {
    activeTag = tag;
    let visibleCount = 0;

    cards.forEach(card => {
      const cardTags = [...card.querySelectorAll('.tag-pill')].map(p => p.textContent.trim().toLowerCase());
      const matches = !tag || cardTags.some(t => t.includes(tag.toLowerCase()));
      
      if (matches) {
        card.classList.remove('fade-out');
        visibleCount++;
      } else {
        card.classList.add('fade-out');
      }
    });

    // Update tag active classes
    allTagPills.forEach(pill => {
      const isMatch = tag && pill.textContent.trim().toLowerCase() === tag.toLowerCase();
      pill.classList.toggle('active', isMatch);
    });

    // Animate typing into MySQL console
    typeQuery(tag, visibleCount);
  }

  function typeQuery(tag, count) {
    if (typingTimer) clearInterval(typingTimer);

    if (!tag) {
      queryTail.innerHTML = ';';
      countEl.textContent = '6 projects';
      consoleBox.classList.remove('active');
      return;
    }

    consoleBox.classList.add('active');
    const targetText = ` WHERE stack LIKE '%${tag}%';`;
    queryTail.innerHTML = '';
    let idx = 0;

    typingTimer = setInterval(() => {
      if (idx < targetText.length) {
        const char = targetText[idx];
        queryTail.textContent += char;
        idx++;
      } else {
        clearInterval(typingTimer);
        // Colorize syntax nicely after typing finishes
        queryTail.innerHTML = ` <span class="kw">WHERE</span> stack <span class="kw">LIKE</span> <span class="str">'%${tag}%'</span>;`;
        countEl.textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
      }
    }, 24);
  }

  // Click on any tech pill inside cards to filter and watch SQL console run
  allTagPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent toggling accordion
      const tag = pill.textContent.trim();
      if (activeTag.toLowerCase() === tag.toLowerCase()) {
        filterProjects(''); // Toggle off
      } else {
        filterProjects(tag);
      }
    });
  });

  // Clicking the console box resets to SELECT * FROM projects;
  if (consoleBox) {
    consoleBox.style.cursor = 'pointer';
    consoleBox.title = 'Click to reset query';
    consoleBox.addEventListener('click', () => {
      filterProjects('');
    });
  }

  // Keyboard interaction: When user focuses or types directly on the page in projects section
  window.addEventListener('keydown', (e) => {
    // If user presses Escape, clear query
    if (e.key === 'Escape') {
      filterProjects('');
    }
  });

  // Initialize with semicolon
  if (queryTail) queryTail.innerHTML = ';';

  // =========================================================================
  // --- CODING & DATABASE AMBIENT IDE ENGINE ---
  // Authentic SQL, C++, Python & Lua streams with syntax highlighting,
  // intelligent center-masking for text clarity, interactive mouse inspection,
  // and real-time query execution telemetry.
  // =========================================================================
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    let dpr = 1;

    // Interactive mouse state
    const mouse = { x: null, y: null, active: false };

    // Real-world SQL & System Code Blocks
    const codeBlocks = [
      // Block 1: SQL Query Optimizer & Indexes
      [
        [ { t: 'kw', s: 'EXPLAIN' }, { t: 'kw', s: 'ANALYZE' }, { t: 'kw', s: 'SELECT' }, { t: 'plain', s: ' u.id, u.username, r.name' } ],
        [ { t: 'kw', s: 'FROM' }, { t: 'plain', s: ' users u' } ],
        [ { t: 'kw', s: 'INNER' }, { t: 'kw', s: 'JOIN' }, { t: 'plain', s: ' user_roles ur ' }, { t: 'kw', s: 'ON' }, { t: 'plain', s: ' ur.user_id = u.id' } ],
        [ { t: 'kw', s: 'INNER' }, { t: 'kw', s: 'JOIN' }, { t: 'plain', s: ' roles r ' }, { t: 'kw', s: 'ON' }, { t: 'plain', s: ' r.id = ur.role_id' } ],
        [ { t: 'kw', s: 'WHERE' }, { t: 'plain', s: ' u.status = ' }, { t: 'str', s: "'active'" }, { t: 'kw', s: ' AND' }, { t: 'plain', s: ' u.login_count >= ' }, { t: 'num', s: '10' } ],
        [ { t: 'kw', s: 'ORDER' }, { t: 'kw', s: 'BY' }, { t: 'plain', s: ' u.last_seen ' }, { t: 'kw', s: 'DESC' }, { t: 'plain', s: ';' } ],
        [ { t: 'comment', s: '-- Index Scan using idx_users_active_seen (Cost: 0.12..4.28)' } ],
        [ { t: 'comment', s: '-- Shared Buffer Pool Hits: 842 / Reads: 0 (Hit Rate: 100%)' } ]
      ],
      // Block 2: C++ Thread-Safe Database Connection Pool
      [
        [ { t: 'comment', s: '// High-throughput asynchronous DB pool' } ],
        [ { t: 'kw', s: 'template' }, { t: 'type', s: '<typename Connection>' } ],
        [ { t: 'kw', s: 'class' }, { t: 'type', s: ' ConnectionPool' }, { t: 'plain', s: ' {' } ],
        [ { t: 'kw', s: 'public:' } ],
        [ { t: 'type', s: '  auto' }, { t: 'fn', s: ' acquire' }, { t: 'plain', s: '() -> ' }, { t: 'type', s: 'std::shared_ptr<Connection>' }, { t: 'plain', s: ' {' } ],
        [ { t: 'type', s: '    std::unique_lock' }, { t: 'plain', s: ' lock(mutex_);' } ],
        [ { t: 'plain', s: '    cv_.wait(lock, [' }, { t: 'kw', s: 'this' }, { t: 'plain', s: ']{ ' }, { t: 'kw', s: 'return' }, { t: 'plain', s: ' !available_.empty(); });' } ],
        [ { t: 'kw', s: '    auto' }, { t: 'plain', s: ' conn = ' }, { t: 'fn', s: 'std::move' }, { t: 'plain', s: '(available_.front());' } ],
        [ { t: 'plain', s: '    available_.pop();' } ],
        [ { t: 'kw', s: '    return' }, { t: 'plain', s: ' conn;' } ],
        [ { t: 'plain', s: '  }' } ],
        [ { t: 'plain', s: '};' } ]
      ],
      // Block 3: SQL Relational DDL & B-Tree Partitioning
      [
        [ { t: 'kw', s: 'CREATE' }, { t: 'kw', s: 'TABLE' }, { t: 'plain', s: ' telemetry_events (' } ],
        [ { t: 'plain', s: '  event_id ' }, { t: 'type', s: 'BIGINT' }, { t: 'kw', s: ' GENERATED' }, { t: 'kw', s: ' ALWAYS' }, { t: 'kw', s: ' AS' }, { t: 'kw', s: ' IDENTITY' }, { t: 'plain', s: ',' } ],
        [ { t: 'plain', s: '  session_id ' }, { t: 'type', s: 'UUID' }, { t: 'kw', s: ' NOT' }, { t: 'kw', s: ' NULL' }, { t: 'plain', s: ',' } ],
        [ { t: 'plain', s: '  payload ' }, { t: 'type', s: 'JSONB' }, { t: 'kw', s: ' DEFAULT' }, { t: 'str', s: " '{}'::jsonb" }, { t: 'plain', s: ',' } ],
        [ { t: 'plain', s: '  created_at ' }, { t: 'type', s: 'TIMESTAMPTZ' }, { t: 'kw', s: ' NOT' }, { t: 'kw', s: ' NULL' } ],
        [ { t: 'plain', s: ') ' }, { t: 'kw', s: 'PARTITION' }, { t: 'kw', s: ' BY' }, { t: 'kw', s: ' RANGE' }, { t: 'plain', s: ' (created_at);' } ],
        [ { t: 'kw', s: 'CREATE' }, { t: 'kw', s: 'INDEX' }, { t: 'plain', s: ' idx_events_sid ' }, { t: 'kw', s: 'ON' }, { t: 'plain', s: ' telemetry_events ' }, { t: 'kw', s: 'USING' }, { t: 'plain', s: ' btree (session_id);' } ],
        [ { t: 'comment', s: '-- Partition chunk: p_2026_q4 created successfully' } ]
      ],
      // Block 4: Python Async Database Worker & Batch Ingestion
      [
        [ { t: 'comment', s: '# Microsecond async transaction stream' } ],
        [ { t: 'kw', s: 'async' }, { t: 'kw', s: ' def' }, { t: 'fn', s: ' sync_batch_records' }, { t: 'plain', s: '(cursor, rows: ' }, { t: 'type', s: 'list[dict]' }, { t: 'plain', s: '):' } ],
        [ { t: 'kw', s: '    async' }, { t: 'kw', s: ' with' }, { t: 'plain', s: ' cursor.transaction():' } ],
        [ { t: 'plain', s: '        sql = ' }, { t: 'str', s: '"""INSERT INTO analytics (key, val, ts)' }, ],
        [ { t: 'str', s: '               VALUES (%s, %s, NOW()) ON CONFLICT DO NOTHING"""' } ],
        [ { t: 'kw', s: '        await' }, { t: 'plain', s: ' cursor.executemany(sql, [(r.k, r.v) ' }, { t: 'kw', s: 'for' }, { t: 'plain', s: ' r ' }, { t: 'kw', s: 'in' }, { t: 'plain', s: ' rows])' } ],
        [ { t: 'kw', s: '    return' }, { t: 'plain', s: ' { ' }, { t: 'str', s: '"status"' }, { t: 'plain', s: ': ' }, { t: 'str', s: '"COMMITTED"' }, { t: 'plain', s: ', ' }, { t: 'str', s: '"count"' }, { t: 'plain', s: ': ' }, { t: 'fn', s: 'len' }, { t: 'plain', s: '(rows) }' } ]
      ],
      // Block 5: Lua Scripting & High-Speed Network Protocol
      [
        [ { t: 'comment', s: '-- Lua runtime packet routing' } ],
        [ { t: 'kw', s: 'function' }, { t: 'fn', s: ' PacketRouter:onMessage' }, { t: 'plain', s: '(clientId, opcode, rawBuffer)' } ],
        [ { t: 'kw', s: '    local' }, { t: 'plain', s: ' handler = self.handlers[opcode]' } ],
        [ { t: 'kw', s: '    if' }, { t: 'kw', s: ' not' }, { t: 'plain', s: ' handler ' }, { t: 'kw', s: 'then' } ],
        [ { t: 'kw', s: '        return' }, { t: 'kw', s: ' false' }, { t: 'plain', s: ', ' }, { t: 'str', s: '"OPCODE_UNKNOWN"' } ],
        [ { t: 'kw', s: '    end' } ],
        [ { t: 'kw', s: '    local' }, { t: 'plain', s: ' packet = self.parser:unpack(rawBuffer)' } ],
        [ { t: 'kw', s: '    return' }, { t: 'plain', s: ' handler(clientId, packet)' } ],
        [ { t: 'kw', s: 'end' } ]
      ],
      // Block 6: SQL Transaction Isolation & Buffer Pool Tuning
      [
        [ { t: 'kw', s: 'START' }, { t: 'kw', s: 'TRANSACTION' }, { t: 'kw', s: ' ISOLATION' }, { t: 'kw', s: ' LEVEL' }, { t: 'kw', s: ' REPEATABLE' }, { t: 'kw', s: ' READ' }, { t: 'plain', s: ';' } ],
        [ { t: 'kw', s: 'UPDATE' }, { t: 'plain', s: ' inventory ' }, { t: 'kw', s: 'SET' }, { t: 'plain', s: ' stock = stock - ' }, { t: 'num', s: '1' } ],
        [ { t: 'kw', s: 'WHERE' }, { t: 'plain', s: ' item_id = ' }, { t: 'num', s: '4096' }, { t: 'kw', s: ' AND' }, { t: 'plain', s: ' stock > ' }, { t: 'num', s: '0' }, { t: 'plain', s: ';' } ],
        [ { t: 'kw', s: 'COMMIT' }, { t: 'plain', s: ';' } ],
        [ { t: 'comment', s: '-- 1 row affected (0.0004 sec) | Lock acquisition: 0.02ms' } ],
        [ { t: 'kw', s: 'SHOW' }, { t: 'plain', s: ' ENGINE INNODB STATUS;' } ]
      ]
    ];

    // Build flat stream of lines for 4 evenly distributed columns across the screen
    const columns = [];

    function buildColumns() {
      columns.length = 0;
      if (W < 50) return;

      // 4 evenly spaced columns spanning from edge to edge
      const colsToRender = W < 640 ? 2 : (W < 960 ? 3 : 4);
      const sideMargin = 24;
      const colStep = (W - sideMargin * 2) / colsToRender;

      for (let c = 0; c < colsToRender; c++) {
        // Flatten blocks with line numbering for this column
        const lines = [];
        let lineNo = 1;
        // Distribute blocks
        for (let b = 0; b < codeBlocks.length; b++) {
          const block = codeBlocks[(b + c * 2) % codeBlocks.length];
          block.forEach(lineTokens => {
            lines.push({
              num: String(lineNo).padStart(2, '0'),
              tokens: lineTokens
            });
            lineNo++;
          });
          // Empty separator line
          lines.push({ num: '  ', tokens: [] });
        }

        // Align column cleanly starting right from the left edge margin
        const colX = sideMargin + (c * colStep);

        columns.push({
          x: colX,
          yOffset: (c * 95) % 400,
          speed: 0.25 + (c % 2) * 0.05,
          lines,
          totalHeight: lines.length * 22
        });
      }
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildColumns();
    }
    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom && 
        e.clientX >= rect.left && 
        e.clientX <= rect.right
      ) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    });

    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    // Color token map
    function getTokenColor(type) {
      switch (type) {
        case 'kw': return '#60A5FA';       // Keyword: clean cobalt blue
        case 'str': return '#FDE047';      // String: bright warm yellow
        case 'type': return '#C084FC';     // Type / Struct: soft purple
        case 'fn': return '#38BDF8';       // Function: sky blue
        case 'num': return '#FB923C';      // Number: amber/orange
        case 'comment': return '#34D399';  // Comment: signature terminal green
        default: return '#E2E8F0';         // Plain identifier / text
      }
    }

    // Main 60 FPS Animation Loop
    function animate() {
      ctx.clearRect(0, 0, W, H);

      const lineHeight = 22;
      const heroContentEl = document.querySelector('.hero-content');
      let textCenterX = W * 0.5;
      let textCenterY = H * 0.5;
      if (heroContentEl) {
        const cRect = heroContentEl.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        textCenterX = (cRect.left - canvasRect.left) + cRect.width * 0.35;
        textCenterY = (cRect.top - canvasRect.top) + cRect.height * 0.5;
      }

      ctx.font = '11.5px "Martian Mono", monospace';
      ctx.textBaseline = 'middle';

      // --- 1. Render Scrolling Code Columns ---
      columns.forEach(col => {
        col.yOffset -= col.speed;
        if (col.yOffset < -col.totalHeight) {
          col.yOffset = 0;
        }

        const startIdx = Math.max(0, Math.floor(-col.yOffset / lineHeight) - 2);
        const endIdx = startIdx + Math.ceil(H / lineHeight) + 4;

        for (let i = startIdx; i < endIdx; i++) {
          const line = col.lines[i % col.lines.length];
          const lineY = col.yOffset + i * lineHeight;

          if (lineY < -20 || lineY > H + 20) continue;

          // Distance to center text (to protect text legibility)
          const distToCenter = Math.hypot(col.x + 80 - textCenterX, lineY - textCenterY);
          
          // Distance to mouse (interactive flashlight)
          let distToMouse = 9999;
          if (mouse.active) {
            distToMouse = Math.hypot(col.x + 80 - mouse.x, lineY - mouse.y);
          }

          // Calculate line opacity:
          // Base opacity: visible on screen sides (0.22-0.28), subtle near center (0.06-0.08)
          let baseAlpha = Math.min(0.28, Math.max(0.06, (distToCenter - 120) / 380 * 0.28));
          
          // Mouse flashlight boost (up to 0.85 near cursor)
          let mouseBoost = 0;
          if (distToMouse < 160) {
            mouseBoost = (1 - distToMouse / 160) * 0.70;
          }

          const finalAlpha = Math.min(0.9, baseAlpha + mouseBoost);
          if (finalAlpha <= 0.02) continue;

          // Render Line Number
          ctx.fillStyle = `rgba(51, 65, 85, ${finalAlpha * 0.8})`;
          ctx.fillText(line.num, col.x, lineY);

          // Render Line Tokens
          let tokenX = col.x + 28;
          for (let tok of line.tokens) {
            ctx.fillStyle = getTokenColor(tok.t);
            ctx.globalAlpha = finalAlpha;
            ctx.fillText(tok.s, tokenX, lineY);
            tokenX += ctx.measureText(tok.s).width;
          }
          ctx.globalAlpha = 1;

          // If line is directly hovered under mouse, draw an active IDE cursor indicator
          if (mouse.active && distToMouse < 26) {
            // Blinking caret
            const caretAlpha = (Math.sin(performance.now() * 0.008) > 0) ? 0.9 : 0.1;
            ctx.fillStyle = `rgba(16, 185, 129, ${caretAlpha})`;
            ctx.fillRect(tokenX + 4, lineY - 6, 2, 13);

            // Subtle highlight line behind code
            ctx.fillStyle = 'rgba(16, 185, 129, 0.06)';
            ctx.fillRect(col.x - 4, lineY - 9, tokenX - col.x + 20, 18);
          }
        }
      });

      // --- 2. Interactive Mouse Ambient Glow ---
      if (mouse.active) {
        // Soft mouse ambient glow
        const glowGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
        glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
        glowGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.04)');
        glowGrad.addColorStop(1, 'rgba(11, 15, 23, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 140, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }
})();
