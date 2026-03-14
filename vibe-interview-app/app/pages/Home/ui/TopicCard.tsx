import { memo } from "react";
import { Link } from "react-router";
import { useLanguage } from "~/contexts/LanguageContext";
import { Card, CardContent, CardFooter } from "~/shared/ui/card";
import { Button } from "~/shared/ui/button";
import { TopicIcon } from "~/shared/ui/TopicIcon";

interface TopicCardProps {
  id: string;
  title: string;
  description: string;
}

export const TopicCard = memo(function TopicCard({ id, title, description }: TopicCardProps) {
  const { t } = useLanguage();
  return (
    <Card className="hover:border-primary transition backdrop-blur-sm bg-card/80">
      <CardContent className="pt-5">
        <TopicIcon id={id} className="w-8 h-8 text-primary mb-3" />
        <h3 className="font-display font-bold text-lg mb-2">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          {description}
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild size="sm" className="flex-1">
          <Link to={`/${id}/theory`}>{t("topicCard.theoryBtn")}</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link to={`/${id}/practice`}>{t("topicCard.practiceBtn")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
});
