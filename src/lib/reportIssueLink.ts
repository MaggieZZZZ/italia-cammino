export interface ReportArgs {
  repo: string;
  pageUrl: string;
  pageTitle: string;
}

export function reportIssueUrl({ repo, pageUrl, pageTitle }: ReportArgs): string {
  const title = `[报错] ${pageTitle}`;
  const body = `**页面**: \`${pageUrl}\`\n\n**问题描述**:\n\n（请描述发现的错误，比如：日期不对、地点写错、餐厅已停业……）`;
  const params = new URLSearchParams({ title, body });
  return `https://github.com/${repo}/issues/new?${params.toString()}`;
}
