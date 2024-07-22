import { memo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { makeStyles, useTheme } from '@rneui/themed';

type ListFooterProps = {
  loading?: boolean;
};

const ListFooter = ({ loading }: ListFooterProps) => {
  const { theme } = useTheme();
  const styles = useStyles();

  return (
    loading && (
      <View style={styles.container}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    )
  );
};

const useStyles = makeStyles(() => ({
  container: {
    alignItems: 'center',
    padding: 16,
  },
}));

export default memo(ListFooter);
