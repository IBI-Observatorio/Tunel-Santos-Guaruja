import cron from 'node-cron';
import newsUpdater from './newsUpdater.js';

class CronScheduler {
  constructor() {
    this.jobs = new Map();
  }

  start() {
    // Agendar atualização diária às 22:00 (horário do servidor)
    // Nota: O Railway usa UTC, então ajuste conforme necessário
    // 22:00 BRT = 01:00 UTC (horário de verão) ou 00:00 UTC (horário padrão)
    
    const schedule = '0 1 * * *'; // 01:00 UTC = 22:00 BRT (horário de verão)
    
    const job = cron.schedule(schedule, async () => {
      console.log('⏰ Iniciando atualização agendada de notícias...');
      
      try {
        const result = await newsUpdater.updateNews();
        
        if (result.success) {
          console.log(`✅ Atualização agendada concluída com sucesso!`);
          console.log(`   - ${result.totalFound} notícias encontradas`);
          console.log(`   - ${result.relevantCount} notícias relevantes`);
          console.log(`   - Duração: ${result.duration}`);
        } else {
          console.error('❌ Erro na atualização agendada:', result.message || result.error);
        }
      } catch (error) {
        console.error('❌ Erro crítico na atualização agendada:', error);
      }
    }, {
      scheduled: true,
      timezone: "UTC" // Usar UTC para consistência com Railway
    });

    this.jobs.set('news-update', job);
    
    console.log('📅 Cron job configurado para atualização diária às 01:00 UTC (22:00 Brasília)');
    
    // Log da próxima execução
    this.logNextExecution();
  }

  stop() {
    this.jobs.forEach(job => job.stop());
    this.jobs.clear();
    console.log('⏹️ Todos os cron jobs foram parados');
  }

  logNextExecution() {
    const now = new Date();
    const next = new Date();
    next.setUTCHours(1, 0, 0, 0); // 01:00 UTC
    
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
    
    console.log(`⏰ Próxima atualização agendada para: ${next.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
  }

  // Método para executar manualmente
  async runNow() {
    console.log('🔄 Executando atualização manual...');
    return await newsUpdater.updateNews();
  }
}

export default new CronScheduler();